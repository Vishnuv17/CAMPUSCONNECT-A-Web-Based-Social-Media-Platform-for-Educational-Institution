// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, get, child, update, set, push ,onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm3Os4kCi8UfNeRCl46OtgXiY506f2wPU",
    authDomain: "campus-connect-cb955.firebaseapp.com",
    databaseURL: "https://campus-connect-cb955-default-rtdb.firebaseio.com",
    projectId: "campus-connect-cb955",
    storageBucket: "campus-connect-cb955.appspot.com",
    messagingSenderId: "931888398108",
    appId: "1:931888398108:web:6f6cab7053dd3cd2cc04d9"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get URL parameter (register number)
const urlParams = new URLSearchParams(window.location.search);
let registerNumber = urlParams.get('reg');

if (registerNumber) {
    sessionStorage.setItem("registerNumber", registerNumber);
} else {
    registerNumber = sessionStorage.getItem("registerNumber");
}

if (registerNumber && registerNumber.trim() !== "") {
    const db = getDatabase(app);
    const dbRef = ref(db);

    get(child(dbRef, `users/${registerNumber}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Update header
            document.querySelector('.handle h4').textContent = data.name || "No Name";
            document.getElementById('handleusername').innerHTML = `${data.username || "No Username"} <i class="uil uil-check-circle"></i>`;

            // Update personal details section
            const contentDiv = document.querySelector('.content');
            contentDiv.innerHTML = `
                <h2><i class="uil uil-book-reader"></i> Personal Details</h2>
                <p>Name : ${data.name || "N/A"}</p>
                <p>Register Number : ${registerNumber}</p>
                <p>Email : ${data.email || "N/A"}</p>
                <p>Phone : ${data.phone || "N/A"}</p>
                <p>Department : ${data.department || "N/A"}</p>
            `;

            // Update profile pictures
            const profileImg = document.querySelector('.profilepic');
            const profileImg2 = document.querySelector('.profilepic2');
            const profileImg3 = document.querySelector('.profilepic3');
            const profileImg4 = document.querySelector('.profilepic4');
            profileImg.src = data.profilepic || "images/defaultprofilepic.jpg";
            profileImg4.src = data.profilepic || "images/defaultprofilepic.jpg";
            profileImg2.src = data.profilepic || "images/defaultprofilepic.jpg";
            profileImg3.src = data.profilepic || "images/defaultprofilepic.jpg";
            document.getElementById('username').innerHTML = `${data.username || "No Username"} <i class="uil uil-check-circle"></i>`;
            document.getElementById('email').textContent = data.email || "N/A";
            document.getElementById('userlevel').textContent = data.designation || "N/A";

            // Followers & Following Count
            const followersCount = data.followers ? data.followers.length : 0;
            const followingCount = data.following ? data.following.length : 0;

            document.querySelector('.followersDetails').innerHTML = `
                <p>${followersCount} followers</p>
                <p>${followingCount} following</p>
            `;

            // 🔥 Load user posts into .posts div
            get(child(dbRef, `posts`)).then((postSnapshot) => {
                if (postSnapshot.exists()) {
                    const postsData = postSnapshot.val();
                    const userPosts = Object.values(postsData).filter(post => post.userId === registerNumber);

                    const postsDiv = document.querySelector('.posts');
                    postsDiv.innerHTML = ''; // Clear existing static images

                    if (userPosts.length === 0) {
                        postsDiv.innerHTML = `<p style="text-align:center; font-size: 1.5rem;margin-left: 50px;">No posts available.</p>`;
                    } else {
                        userPosts.forEach(post => {
                            const img = document.createElement('img');
                            img.src = post.imageUrl;
                            img.alt = "User Post";
                            postsDiv.appendChild(img);
                        });
                    }
                }
            }).catch(err => {
                console.error("Error fetching posts:", err);
            });

        } else {
            alert("User not found!");
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
} else {
    window.location.href = "register.html";
    alert("No register number provided!");
}






//post upload
document.getElementById("PostUploadbtn").addEventListener("click", async () => {
    const file = document.getElementById("upload").files[0];
    const caption = document.getElementById("caption").value;
    const location = document.getElementById("location").value;
    const hashtags = document.getElementById("hashtags").value;
    const registerNumber = sessionStorage.getItem("registerNumber");

    if (!file || !caption || !location || !registerNumber || !hashtags) {
        alert("All fields are required!");
        return;
    }

    // Step 1: Get current username from Firebase
    const db = getDatabase();
    const userRef = ref(db, `users/${registerNumber}`);
    const userSnap = await get(userRef);
    if (!userSnap.exists()) {
        alert("User not found!");
        return;
    }

    const username = userSnap.val().username;
    const profilepic = userSnap.val().profilepic;
    const name = userSnap.val().name;

    // Step 2: Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "campusconnect");

    let imageUrl = "";

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dkjxuw8hd/image/upload", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        imageUrl = data.secure_url;

        if (!imageUrl) {
            alert("Cloudinary returned no image URL.");
            return;
        }

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        alert("Image upload failed!");
        return;
    }

    // Step 3: Upload post to Firebase
    const postsRef = ref(db, "posts");
    const newPostRef = push(postsRef);

    const postData = {
        userId: registerNumber,
        username: username,
        name: name,
        imageUrl: imageUrl,
        profilepic:profilepic,
        caption: caption,
        hashtags:hashtags,
        location: location,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    set(newPostRef, postData)
        .then(() => {
            alert("Post uploaded successfully!");
            document.getElementById("caption").value = "";
            document.getElementById("location").value = "";
            document.getElementById("preview").src = "images/defaultprofilepic.jpg";
            document.getElementById("upload").value = "";

            const notificationData = {
                message: "New Post Upload",
                timestamp: new Date().toISOString(),
                profilepic: profilepic,
                type: "post_upload"
            };
            
            // Store notification in Firebase
            const notificationsRef = ref(db, `users/${registerNumber}/notification`);
            const newNotificationRef = push(notificationsRef);  // Create a unique ID for the notification
            set(newNotificationRef, notificationData);

        })
        .catch((err) => {
            console.error("Firebase upload failed:", err);
            alert("Post upload failed: " + err.message);
        });
});




//LogOut
function logout() {
    sessionStorage.removeItem("registerNumber");
    alert("Logged out!");
    window.location.href = "register.html"; // or your login/start page
}

window.logout = logout;





//ProfilePic Change
document.querySelector('.useredit').addEventListener('click', () => {
    document.getElementById('profileUpload').click();
});

document.getElementById('profileUpload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview instantly
    const imgElement = document.querySelector('.img__container img');
    imgElement.src = URL.createObjectURL(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "campusconnect"); // ✅ Replace with your actual preset name

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dkjxuw8hd/image/upload", { // ✅ Replace with your cloud name
            method: "POST",
            body: formData
        });

        const cloudData = await res.json();
        const imageUrl = cloudData.secure_url;

        // Save to Firebase
        const db = getDatabase(app);
        await update(ref(db, `users/${registerNumber}`), {
            profilepic: imageUrl
        });

        // Final display
        imgElement.src = imageUrl;

        alert("Profile picture updated successfully!");

        const notificationData = {
            message: "Profile picture Changed",
            timestamp: new Date().toISOString(),
            profilepic: imageUrl,
            type: "profile_picture_change"
        };
        
        // Store notification in Firebase
        const notificationsRef = ref(db, `users/${registerNumber}/notification`);
        const newNotificationRef = push(notificationsRef);  // Create a unique ID for the notification
        set(newNotificationRef, notificationData);

    } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload image to Cloudinary!");
    }
});





//Feed Load
const db = getDatabase();
const postsRef = ref(db, "posts/");
const feedsContainer = document.getElementById("feedsContainer"); // Your container

get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
        const posts = [];

        // Collect all posts into array
        snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            post.key = childSnapshot.key;
            posts.push(post);
        });

        // Sort latest first
        posts.reverse();

        //posts.sort(() => Math.random() - 0.5);


        // Loop through posts and get user details one by one
        posts.forEach((post) => {
            const reg = post.userId;
            const userRef = ref(db, "users/" + reg);

            get(userRef).then((userSnap) => {
                if (userSnap.exists()) {
                    const user = userSnap.val();

                    // Assign live user data
                    post.username = user.username;
                    post.profilepic = user.profilepic;
                }

                const currentUser = sessionStorage.getItem("registerNumber");
                const isLiked = post.likedUsers && post.likedUsers.includes(currentUser);
                const likeIconColor = isLiked ? 'red' : 'black';
                const feedHTML = `
                    <div class="feed">
                        <div class="head">
                            <div class="user">
                                <div class="profile-photo">
                                    <img src="${post.profilepic}">
                                </div>
                                <div class="info">
                                    <a href="javascript:void(0)" class="username-link" data-username="${post.username}" data-userid="${post.userId}">
                        <h3>${post.username}</h3>
                    </a>
                                    <small>
                                        <i class="uil uil-map-marker"></i>${post.location}
                                        <i class="uil uil-calendar-alt"></i>${formatTimestamp(post.timestamp)}
                                    </small>
                                </div>
                            </div>
                            <span class="edit">
                                <i class="uil uil-ellipsis-h"></i>
                            </span>
                        </div>

                        <div class="photo">
                            <img src="${post.imageUrl}">
                        </div>

                        <div class="action-buttons">
        <div class="interaction-buttons">
            <span class="like-btn" data-key="${post.key}">
                <i class="uil uil-heart" style="color: ${likeIconColor};"></i> 
                <span class="like-count">${post.likes || 0}</span>
            </span>
            <span><i class="uil uil-comment-dots"></i></span>
            <span><i class="uil uil-share-alt"></i></span>
        </div>
        <div class="bookmark">
            <span><i class="uil uil-bookmark-full"></i></span>
        </div>
    </div>



                        ${(post.likedBy && post.likedBy.length > 0) ? `
                            <div class="liked-by">
                                ${(post.likedBy || []).map(pic => `<span><img src="${pic}" alt="pic" style="width:20px;height:20px;border-radius:50%;margin-right:5px;"></span>`).join('')}
                                <p>Liked by <b>${post.likedText}</b></p>
                            </div>

                        ` : ''}
                        

                        <div class="caption">
                            <p><b>${post.name}</b> - ${post.caption}
                            <span class="harsh-tag">${post.hashtags}</span></p>
                        </div>

                        <div class="comments text-muted">
                            View all ${post.commentsCount} comments
                        </div>
                    </div>
                `;

                feedsContainer.innerHTML += feedHTML;

            });
        });
    } else {
        feedsContainer.innerHTML = "<p>No posts found.</p>";
    }
}).catch((error) => {
    console.error("Error getting posts:", error);
});


//Like Button
feedsContainer.addEventListener("click", function (e) {
    const likeBtn = e.target.closest(".like-btn");
    if (!likeBtn) return;

    const postKey = likeBtn.getAttribute("data-key");
    const currentUser = sessionStorage.getItem("registerNumber");
    if (!postKey || !currentUser) return;

    const postRef = ref(db, "posts/" + postKey);
    const userRef = ref(db, "users/" + currentUser);

    Promise.all([get(postRef), get(userRef)])
        .then(([postSnap, userSnap]) => {
            if (!postSnap.exists() || !userSnap.exists()) return;

            const postData = postSnap.val();
            const userData = userSnap.val();

            let currentLikes = postData.likes || 0;
            let likedUsers = postData.likedUsers || [];
            let likedBy = postData.likedBy || [];

            const alreadyLiked = likedUsers.includes(currentUser);

            if (alreadyLiked) {
                currentLikes = Math.max(0, currentLikes - 1);
                likedUsers = likedUsers.filter(id => id !== currentUser);
                likedBy = likedBy.filter(pic => pic !== userData.profilepic);
            } else {
                currentLikes += 1;
                likedUsers.push(currentUser);
                likedBy.push(userData.profilepic || "images/defaultprofilepic.jpg");

            }

            // Generate likedText
            let likedText = '';
            if (likedUsers.length === 1) {
                likedText = userData.username;
            } else if (likedUsers.length > 1) {
                const firstUserRef = ref(db, "users/" + likedUsers[0]);
                return get(firstUserRef).then(firstUserSnap => {
                    const firstUsername = firstUserSnap.exists() ? firstUserSnap.val().username : "Someone";
                    likedText = `${firstUsername} and ${likedUsers.length - 1} others`;

                    return update(postRef, {
                        likes: currentLikes,
                        likedUsers: likedUsers,
                        likedBy: likedBy,
                        likedText: likedText
                    });
                });
            }

            return update(postRef, {
                likes: currentLikes,
                likedUsers: likedUsers,
                likedBy: likedBy,
                likedText: likedText
            });
        })
        .then(() => {
            const icon = likeBtn.querySelector("i");
            const countText = likeBtn.querySelector(".like-count");

            icon.style.color = icon.style.color === "red" ? "black" : "red";
            countText.textContent = parseInt(countText.textContent) + (icon.style.color === "red" ? 1 : -1);
        })
        .catch((err) => {
            console.error("Like update failed:", err);
        });
});





function formatTimestamp(isoString) {
    const postDate = new Date(isoString);
    const now = new Date();
    const diffMs = now - postDate;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    const remainingMinutes = diffMinutes % 60;
    const remainingHours = diffHours % 24;
    const remainingDays = diffDays % 30;

    if (diffSeconds < 60) {
        return `${diffSeconds} sec ago`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hr ${remainingMinutes} min ago`;
    } else if (diffDays < 30) {
        return `${diffDays} days ${remainingHours} hr ago`;
    } else {
        return `${diffMonths} months ${remainingDays} days ago`;
    }
}

//Material Upload Module Visible
const currentUser = sessionStorage.getItem("registerNumber");
const userRef = ref(db, "users/" + currentUser);

get(userRef).then(snapshot => {
    if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.designation == "Staff") {
            document.querySelector(".materialUpload").style.display = "block";
        } else {
            document.querySelector(".materialUpload").style.display = "none";
        }
    }
});


//Material Upload in Cloud 
document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Please select a file");

    const currentUser = sessionStorage.getItem("registerNumber");

    try {
        const userSnapshot = await get(ref(db, "users/" + currentUser));
        if (!userSnapshot.exists()) {
            return alert("User data not found");
        }

        const userData = userSnapshot.val();
        const department = userData.department;

        // Uploading to Cloudinary (force resource_type: raw)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "campusconnect");
        formData.append("resource_type", "raw"); // 👈 Add this line

        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dkjxuw8hd/raw/upload", {
            method: "POST",
            body: formData
        });

        const cloudData = await cloudRes.json();
        const fileURL = cloudData.secure_url;

        // Save to Firebase
        const newFileRef = push(ref(db, 'materials/' + department));
        await set(newFileRef, {
            name: file.name,
            url: fileURL,
            uploadedBy: currentUser,
            timestamp: Date.now()
        });

        alert("File uploaded successfully!");
        document.getElementById("uploadForm").reset();
        loadFiles();
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Try again.");
    }
});


async function loadFiles() {
    const fileList = document.querySelector(".file_list");
    fileList.innerHTML = "";

    const currentUser = sessionStorage.getItem("registerNumber");
    if (!currentUser) return;

    try {
        // Get user department
        const userSnapshot = await get(ref(db, "users/" + currentUser));
        if (!userSnapshot.exists()) return;

        const userData = userSnapshot.val();
        const department = userData.department;

        // Get only materials under this department
        const materialSnapshot = await get(ref(db, "materials/" + department));
        if (!materialSnapshot.exists()) return;

        const data = materialSnapshot.val();
        Object.values(data).forEach(file => {
            fileList.innerHTML += `
                <div class="file">
                    <i class="uil uil-file"></i>
                    <h5>${file.name}</h5>
                    <span class="edit">
    <i class="uil uil-ellipsis-h options-toggle"></i> <!-- Added class for JS -->
    <div class="options-menu">
        <a href="${file.url}" class="download" download>Download</a>
        <a href="${file.url}" target="_blank" rel="noopener noreferrer" class="download">Open</a>
        <a href="#" class="delete">Delete</a>
    </div>
</span>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading files:", error);
    }
}

loadFiles();

//Feed page Post Username cliCk then open that user profile
// Feed page Post Username click, then open that user profile
feedsContainer.addEventListener("click", function(e) {
    const usernameLink = e.target.closest(".username-link");
    if (!usernameLink) return;

    const userId = usernameLink.getAttribute("data-userid");
    if (!userId) return;
    sessionStorage.setItem("visitedUserId", userId); // 👈 Add this line


    // Fetch user data based on userId
    const userRef = ref(db, "users/" + userId);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const user = snapshot.val();

            document.getElementById('username').innerHTML = `${user.username || "No Username"} <i class="uil uil-check-circle"></i>`;
            document.getElementById('email').textContent = user.email || "N/A";
            document.getElementById('userlevel').textContent = user.designation || "N/A";
            const profileImg = document.querySelector('.profilepic');
            profileImg.src = user.profilepic || "images/defaultprofilepic.jpg";

            // Followers & Following Count
            const followersCount = user.followers ? user.followers.length : 0;
            const followingCount = user.following ? user.following.length : 0;

            document.querySelector('.followersDetails').innerHTML = `
                <p>${followersCount} followers</p>
                <p>${followingCount} following</p>
            `;

            const studyMaterial = document.querySelector('.study-material');
            const msgConversation = document.querySelector('.msgConversation');
            const groupConversation = document.querySelector('.grpConversation');
            const AskProfilePicture = document.querySelector('.AskProfilePicture');
            const themeContainer = document.querySelector('.customize-theme');

            AskProfilePicture.style.display = 'grid';
            document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
            document.querySelector(".middle").style.display = 'none';
            document.querySelector(".right").style.display = 'none';
            groupConversation.style.display = 'none';
            msgConversation.style.display = 'none';
            studyMaterial.style.display = 'none';
            themeContainer.style.display = 'none';

            // Update personal details section
            const contentDiv = document.querySelector('.content');
            contentDiv.innerHTML = `
                <h2><i class="uil uil-book-reader"></i> Personal Details</h2>
                <p>Name : ${user.name || "N/A"}</p>
                <p>Register Number : ${user.register_number}</p>
                <p>Email : ${user.email || "N/A"}</p>
                <p>Phone : ${user.phone || "N/A"}</p>
                <p>Department : ${user.department || "N/A"}</p>
            `;

            // 🔥 Load the posts of the clicked user
            const db = getDatabase(app);
    const dbRef = ref(db);
            get(child(dbRef, `posts`)).then((postSnapshot) => {
                if (postSnapshot.exists()) {
                    const postsData = postSnapshot.val();
                    // Filter posts by the userId of the profile being viewed
                    const userPosts = Object.values(postsData).filter(post => post.userId === userId);

                    const postsDiv = document.querySelector('.posts');
                    postsDiv.innerHTML = ''; // Clear existing static images

                    if (userPosts.length === 0) {
                        postsDiv.innerHTML = `<p style="text-align:center;  font-size: 1rem;">No posts available.</p>`;
                    } else {
                        userPosts.forEach(post => {
                            const img = document.createElement('img');
                            img.src = post.imageUrl;
        
                            img.alt = "User Post";
                            postsDiv.appendChild(img);
                        });
                    }
                }
            }).catch(err => {
                console.error("Error fetching posts:", err);
            });

            document.querySelector('.useredit').style.display = 'none';
        } else {
            alert("User not found!");
        }
    }).catch((error) => {
        console.error("Error fetching user data:", error);
    });
});

//Follow
document.querySelector('.follow').addEventListener('click', async function () {
    const currentUserId = sessionStorage.getItem("registerNumber");
    const visitedUserId = sessionStorage.getItem("visitedUserId"); // ✅ correct value from click

    if (!currentUserId || !visitedUserId || currentUserId === visitedUserId) return;

    const db = getDatabase(app);
    const currentUserRef = ref(db, "users/" + currentUserId);
    const visitedUserRef = ref(db, "users/" + visitedUserId);

    try {
        const [currentSnapshot, visitedSnapshot] = await Promise.all([
            get(currentUserRef),
            get(visitedUserRef)
        ]);

        if (!currentSnapshot.exists() || !visitedSnapshot.exists()) return;

        const currentData = currentSnapshot.val();
        const visitedData = visitedSnapshot.val();

        let currentFollowing = currentData.following || [];
        let visitedFollowers = visitedData.followers || [];

        if (!currentFollowing.includes(visitedUserId)) {
            currentFollowing.push(visitedUserId);
        }

        if (!visitedFollowers.includes(currentUserId)) {
            visitedFollowers.push(currentUserId);
        }

        await Promise.all([
            update(currentUserRef, { following: currentFollowing }),
            update(visitedUserRef, { followers: visitedFollowers })
        ]);

        document.querySelector('.follow').textContent = "Following";
        document.querySelector('.follow').classList.add("following");
        document.querySelector('.followersDetails p:first-child').textContent = `${visitedFollowers.length} followers`;

        console.log("Follow successful!");
    } catch (err) {
        console.error("Error during follow:", err);
    }
});


//Notifications
document.getElementById("notifications").addEventListener("click", () => {
    const currentUserId = registerNumber; // Replace dynamically for current user
    const notificationPopup = document.getElementById("notificationPopup");

    const notificationsRef = ref(db, 'users/' + currentUserId + '/notification');

    get(notificationsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifications = snapshot.val();
            notificationPopup.innerHTML = ""; // Clear previous ones

            Object.values(notifications).reverse().forEach(notification => {
                const div = document.createElement('div');
                const formattedTimestamp = formatTimestamp(notification.timestamp);

                div.innerHTML = `
                <div class="profile-photo">
                            <img src="${notification.profilepic}" alt="">
                        </div>
                    <div class="notification-body">
                        <b>${notification.message}</b><br>
                        <small class="text-muted">${formattedTimestamp}</small>
                    </div>
                `;
                notificationPopup.appendChild(div);
            });
        } else {
            notificationPopup.innerHTML = "<p>No notifications found.</p>";
        }
    }).catch((error) => {
        notificationPopup.innerHTML = "<p>Error loading notifications.</p>";
        console.error("Notification error:", error);
    });
});

const msgRightContainer = document.querySelector('.right .message-container'); // Target the message container

//Right Side Message Container
document.addEventListener('DOMContentLoaded', function () {
    const currentUserId = sessionStorage.getItem("registerNumber"); // Get the current user ID

    if (!currentUserId) return; // If no current user, exit

    const db = getDatabase(app);
    const currentUserRef = ref(db, "users/" + currentUserId);

    // Fetch the current user data to get their following/followers list
    get(currentUserRef).then(snapshot => {
        if (snapshot.exists()) {
            const currentUser = snapshot.val();

            // Get both following and followers list
            const followingList = currentUser.following || [];
            const followersList = currentUser.followers || [];

            // Combine both lists and remove duplicates
            const combinedList = [...new Set([...followingList, ...followersList])];

            const msgRightContainer = document.querySelector('.right .message-container'); // Target the message container
            
            // Clear previous static messages
            msgRightContainer.innerHTML = '';

            // Create and add the heading and search bar
            msgRightContainer.innerHTML = `
                <div class="heading">
                    <h4>Messages</h4>
                    <i class="uil uil-edit"></i>
                </div>
                <div class="search-bar">
                    <i class="uil uil-search"></i>
                    <input type="search" placeholder="Search messages" id="message-search">
                </div>
            `;

            // Loop through the combined list of users
            combinedList.forEach(userId => {
                const userRef = ref(db, `users/${userId}`);
                get(userRef).then(userSnapshot => {
                    if (userSnapshot.exists()) {
                        const user = userSnapshot.val();

                        // Create a new dynamic message element
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message');

                        messageElement.innerHTML = `
                            <div class="profile-photo" msgdata-userid="${user.register_number}">
                                <img src="${user.profilepic || './images/defaultprofilepic.jpg'}">
                            </div>
                            <div class="message-body">
                                <h5>${user.username || 'Unknown User'}</h5>
                                <p class="text-muted">Say hi! 👋</p>
                            </div>
                        `;

                        // Append the message to the msgLeft container
                        msgRightContainer.appendChild(messageElement);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Error fetching current user data:", error);
    });
});





//Message page load
document.addEventListener('DOMContentLoaded', function () {
    const currentUserId = sessionStorage.getItem("registerNumber"); // Get the current user ID

    if (!currentUserId) return; // If no current user, exit

    const db = getDatabase(app);
    const currentUserRef = ref(db, "users/" + currentUserId);

    // Fetch the current user data to get their following/followers list
    get(currentUserRef).then(snapshot => {
        if (snapshot.exists()) {
            const currentUser = snapshot.val();

            // Get both following and followers list
            const followingList = currentUser.following || [];
            const followersList = currentUser.followers || [];

            // Combine both lists and remove duplicates
            const combinedList = [...new Set([...followingList, ...followersList])];

            const msgLeftContainer = document.querySelector('.msgLeft'); // Target the msgLeft container
            
            // Clear previous static messages
            msgLeftContainer.innerHTML = '';

            // Create and add the heading and search bar
            msgLeftContainer.innerHTML = `
                <div class="heading">
                    <h4>Messages</h4>
                    <i class="uil uil-edit"></i>
                </div>
                <div class="search-bar">
                    <i class="uil uil-search"></i>
                    <input type="search" placeholder="Search messages" id="message-search">
                </div>
            `;

            // Loop through the combined list of users
            combinedList.forEach(userId => {
                const userRef = ref(db, `users/${userId}`);
                get(userRef).then(userSnapshot => {
                    if (userSnapshot.exists()) {
                        const user = userSnapshot.val();

                        // Create a new dynamic message element
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message');

                        messageElement.innerHTML = `
                            <div class="profile-photo" msgdata-userid="${user.register_number}">
                                <img src="${user.profilepic || './images/defaultprofilepic.jpg'}">
                            </div>
                            <div class="message-body">
                                <h5>${user.username || 'Unknown User'}</h5>
                                <p class="text-muted">Say hi! 👋</p>
                            </div>
                        `;

                        // Append the message to the msgLeft container
                        msgLeftContainer.appendChild(messageElement);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Error fetching current user data:", error);
    });
});





document.querySelector('.msgLeft').addEventListener('click', function (e) {
    const messageElement = e.target.closest('.message');
    if (!messageElement) return;

    const senderId = messageElement.querySelector('h5').textContent;
    const userId = messageElement.querySelector('.profile-photo').getAttribute('msgdata-userid');
    const currentUser = sessionStorage.getItem("registerNumber");

    console.log(userId)

    const db = getDatabase(app);
    const chatBox = document.querySelector('.chat-box');
    const chatHeader = document.querySelector('.chat-header');

    // Show chat UI
    document.querySelector('.msgRight').style.display = 'block';
    
    chatBox.innerHTML = '';
    chatHeader.textContent = `Chat with ${senderId}`;

    // Reference for currentUser → receiver
    const chatRef = ref(db, `chats/${currentUser}/${userId}`);

    // Fetch and display messages
    get(chatRef).then(snapshot => {
        if (snapshot.exists()) {
            const messages = snapshot.val();
            Object.entries(messages).forEach(([messageId, msg]) => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', msg.sender === currentUser ? 'sent' : 'received');
                messageDiv.textContent = msg.text;
                chatBox.appendChild(messageDiv);
            });
        } else {
            console.log("No previous chat found.");
        }
    }).catch((error) => {
        console.error("Error fetching chat:", error);
    });

    // Send message button
    document.querySelector('.chat-input button').onclick = function () {
        const messageInput = document.querySelector('.chat-input input');
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        const receiver = userId;
        const newMessageKey = push(child(ref(db), `chats/${currentUser}/${receiver}`)).key;

        const message = {
            text: messageText,
            sender: currentUser,
            receiver: receiver,
            timestamp: Date.now()
        };

        const updates = {};
        updates[`chats/${currentUser}/${receiver}/${newMessageKey}`] = message;
        updates[`chats/${receiver}/${currentUser}/${newMessageKey}`] = message;

        update(ref(db), updates).then(() => {
            console.log("Message sent!");
            messageInput.value = '';

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.textContent = messageText;
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }).catch((error) => {
            console.error("Error sending message:", error);
        });
    };
});



//Explore Page
const usersRef = ref(db, "users/");
const suggestionContainer = document.querySelector(".frdSuggestionCantainer");

get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;

            // Avoid showing current user
            const currentUser = sessionStorage.getItem("registerNumber");
            if (userId === currentUser) return;

            const userHTML = `
                <div class="friend-suggestion">
                    <div class="profile-photo">
                        <img src="${user.profilepic || './images/default.jpg'}" alt="Friend">
                    </div>
                    <div class="friend-info">
                        <h5>${user.username}</h5>
                        <p class="text-muted">${userId}</p>
                    </div>
                    <b class="dept"><i class="uil uil-graduation-cap"></i>${user.department}</b>
                    <button class="btn-follow">
                        <i class="uil uil-user-check"></i> Follow
                    </button>
                </div>
            `;
            suggestionContainer.innerHTML += userHTML;
        });



        //Follow
        document.querySelectorAll(".btn-follow").forEach((button) => {
            button.addEventListener("click", async function () {
                const currentUserId = sessionStorage.getItem("registerNumber");
        
                // Get visitedUserId from the card
                const friendCard = button.closest(".friend-suggestion");
                const visitedUserId = friendCard.querySelector("p.text-muted").textContent;
                console.log(currentUserId);
                console.log(visitedUserId);
        
                if (!currentUserId || !visitedUserId || currentUserId === visitedUserId) return;
        
                const db = getDatabase(app);
                const currentUserRef = ref(db, "users/" + currentUserId);
                const visitedUserRef = ref(db, "users/" + visitedUserId);
        
                try {
                    const [currentSnapshot, visitedSnapshot] = await Promise.all([
                        get(currentUserRef),
                        get(visitedUserRef)
                    ]);
        
                    if (!currentSnapshot.exists() || !visitedSnapshot.exists()) return;
        
                    const currentData = currentSnapshot.val();
                    const visitedData = visitedSnapshot.val();
        
                    let currentFollowing = currentData.following || [];
                    let visitedFollowers = visitedData.followers || [];
        
                    if (!currentFollowing.includes(visitedUserId)) {
                        currentFollowing.push(visitedUserId);
                    }
        
                    if (!visitedFollowers.includes(currentUserId)) {
                        visitedFollowers.push(currentUserId);
                    }
        
                    await Promise.all([
                        update(currentUserRef, { following: currentFollowing }),
                        update(visitedUserRef, { followers: visitedFollowers })
                    ]);
        
                    // ✅ Update button UI
                    button.innerHTML = `<i class="uil uil-user-check"></i> Following`;
                    button.classList.add("following");
        
                    console.log("Followed", visitedUserId);
                } catch (err) {
                    console.error("Error during follow:", err);
                }
            });
        });


    } else {
        suggestionContainer.innerHTML = "<p>No users found.</p>";
    }
}).catch((error) => {
    console.error("Error fetching users:", error);
});


// ✅ Load All Posts into Explore Page
const posts = ref(db, "posts/");
const postsContainer = document.querySelector(".posts-container");

get(posts).then((snapshot) => {
    if (snapshot.exists()) {
        const posts = [];

        snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            post.key = childSnapshot.key;
            posts.push(post);
        });

        // Show latest first
        posts.reverse();

        // Shuffle the array randomly
        // posts.sort(() => Math.random() - 0.5);

        posts.forEach((post) => {
            const postHTML = `
                <div class="post">
                <a href="${post.imageUrl}" target="_blank">
                <img src="${post.imageUrl}" alt="Post">
                </a>
                </div>
                `;
            postsContainer.innerHTML += postHTML;
        });
    } else {
        postsContainer.innerHTML = "<p>No posts found.</p>";
    }
}).catch((error) => {
    console.error("Error getting posts:", error);
});


//Search User in Explore Page
const searchInput = document.getElementById("explore-search");

searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const allSuggestions = document.querySelectorAll(".friend-suggestion");

    let matchFound = false;

    allSuggestions.forEach((card) => {
        const username = card.querySelector("h5").textContent.toLowerCase();
        const userId = card.querySelector("p").textContent.toLowerCase();
        const rno = card.querySelector("b").textContent.toLowerCase();

        // If input is empty, hide
        if (query === "") {
            card.style.display = "flex";
            matchFound = false;
        } else if (username.includes(query) || userId.includes(query) || rno.includes(query)) {
            card.style.display = "flex";
            matchFound = true;
        } else {
            card.style.display = "none";
        }
    });

    // Show container only if there's a match or input is empty
    suggestionContainer.style.display = matchFound ? "flex" : "none";
});

//Report


document.getElementById("submitBtn").addEventListener("click", () => {
    const reportText = document.getElementById("reportText").value;
    if (reportText.trim() === "") {
        alert("Please write something in the report.");
        return;
    }

    // Get current user details from Firebase
    const userRef = ref(db, `users/${registerNumber}`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();

            // Now store report with user data
            const reportData = {
                username: userData.username,
                register: registerNumber,
                department: userData.department,
                profileImage: userData.profilepic,
                text: reportText
            };

            push(ref(db, "reports"), reportData).then(() => {
                alert("✅ Report submitted securely");
                document.getElementById("reportText").value = "";
            }).catch((error) => {
                alert("Error submitting report: " + error.message);
            });

        } else {
            alert("User not found in database.");
        }
    }).catch((error) => {
        alert("Error getting user data: " + error.message);
    });
});



const reportRef = ref(db, "reports");

// Target container
const reportList = document.getElementById("reportList");

// Realtime fetch
onValue(reportRef, (snapshot) => {
    reportList.innerHTML = ""; // Clear before re-render
    snapshot.forEach((child) => {
        const data = child.val();

        const html = `
        <div class="report">
            <div class="userDetails">
                <img src="${data.profileImage}" alt="User Photo">
                <div class="userInfo">
                    <h3>${data.username}</h3>
                    <small>
                        <i class="uil uil-map-marker"></i> ${data.department}
                        <i class="uil uil-calendar-alt"></i> ${data.register}
                    </small>
                </div>
            </div>
            <div class="reportContent">
                <p>${data.text}</p>
            </div>
        </div>
        `;
        reportList.innerHTML += html;
    });
});



// Target the elements
const reportText = document.getElementById("reportText");
const submitBtn = document.getElementById("submitBtn");

// Show only report list if register number matches
if (registerNumber === "8208E23CAR062") {
    // Show report list
    reportList.style.display = "block";

    // Hide textarea and submit button
    reportText.style.display = "none";
    submitBtn.style.display = "none";
} else {
    // Show textarea and button for others
    reportText.style.display = "block";
    submitBtn.style.display = "block";

    // Optionally hide report list
    reportList.style.display = "none";
}
