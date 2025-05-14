
// Sidebar
const menuItems = document.querySelectorAll('.menu-item');

// Messages 
const messageNotification = document.querySelector('#messages-notifications');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');

//Theme
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSize = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');



// ============== SIDEBAR ============== 

// Remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        changeActiveItem();
        item.classList.add('active');

        const popup = document.querySelector('.notifications-popup');

        if (item.id === 'notifications') {
            // Toggle visibility
            if (popup.style.display === 'block') {
                popup.style.display = 'none';
            } else {
                popup.style.display = 'block';
                document.querySelector('#notifications .notification-count').style.display = 'none';
            }

            e.stopPropagation(); // Prevent bubbling to document
        } else {
            popup.style.display = 'none';
        }
    });
});

// Hide popup when clicking outside
document.addEventListener('click', function(e) {
    const popup = document.querySelector('.notifications-popup');
    const notificationsBtn = document.querySelector('#notifications');

    if (!popup.contains(e.target) && !notificationsBtn.contains(e.target)) {
        popup.style.display = 'none';
    }
});





// ============== MESSAGES ============== 

//Searches messages
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1) {
            user.style.display = 'flex'; 
        } else {
            user.style.display = 'none';
        }
    })
}

//Search for messages
messageSearch.addEventListener('keyup', searchMessage);




// ============== THEME / DISPLAY CUSTOMIZATION ============== 



// ============== FONT SIZE ============== 

// remove active class from spans or font size selectors
const removeSizeSelectors = () => {
    fontSize.forEach(size => {
        size.classList.remove('active');
    })
}

fontSize.forEach(size => { 
   size.addEventListener('click', () => {
        removeSizeSelectors();
        let fontSize;
        size.classList.toggle('active');

        if(size.classList.contains('font-size-1')) { 
            fontSize = '10px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '5.4rem');
        } else if(size.classList.contains('font-size-2')) { 
            fontSize = '13px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '-7rem');
        } else if(size.classList.contains('font-size-3')) {
            fontSize = '16px';
            root.style.setProperty('----sticky-top-left', '-2rem');
            root.style.setProperty('----sticky-top-right', '-17rem');
        } else if(size.classList.contains('font-size-4')) {
            fontSize = '19px';
            root.style.setProperty('----sticky-top-left', '-5rem');
            root.style.setProperty('----sticky-top-right', '-25rem');
        } else if(size.classList.contains('font-size-5')) {
            fontSize = '22px';
            root.style.setProperty('----sticky-top-left', '-12rem');
            root.style.setProperty('----sticky-top-right', '-35rem');
        }

        // change font size of the root html element
        document.querySelector('html').style.fontSize = fontSize;
   })
})

// Remove active class from colors
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

// Change color primary
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primary;
        changeActiveColorClass(); 

        if(color.classList.contains('color-1')) {
            primaryHue = 252;
        } else if(color.classList.contains('color-2')) {
            primaryHue = 52;
        } else if(color.classList.contains('color-3')) {
            primaryHue = 352;
        } else if(color.classList.contains('color-4')) {
            primaryHue = 152;
        } else if(color.classList.contains('color-5')) {
            primaryHue = 202;
        }

        color.classList.add('active');
        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})

//Theme Background Values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// Changes background color
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
}

Bg1.addEventListener('click', () => {
    // add active class
    Bg1.classList.add('active');
    // remove active class from the others
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    //remove customized changes from local storage
    window.location.reload();
});

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';

    // add active class
    Bg2.classList.add('active');
    // remove active class from the others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    // add active class
    Bg3.classList.add('active');
    // remove active class from the others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
});

//Home Page 
const homebtn=document.getElementById('home');

//Theme
const themebtn=document.getElementById('theme');
const themeContainer=document.querySelector('.customize-theme');

// Study Material
const studyMaterial = document.querySelector('.study-material');
const studyMaterialMenu = document.getElementById('studyMaterial');
const fileCard = document.querySelector('.file-card'); // Inner card

// Messages Section
const msgConversation = document.querySelector('.msgConversation');
const msgContainer = document.querySelector('.msgchat-container');
const msgMenu = document.getElementById('messages-notifications');

// Group-Messages Section
const groupConversation=document.querySelector('.grpConversation');
const grpbutton = document.getElementById('groupConversation');
const grpContainer = document.querySelector('.grpchat-container');

// Profile Pic Section
const AskProfilePicture=document.querySelector('.AskProfilePicture');
const userpicbutton = document.getElementById('userpic');
const ProfilePictureContainer = document.querySelector('.ProfilePictureContainer');

// Explore
const Explorecontainer=document.querySelector('.explore-container');
const Explorebtn = document.getElementById('explore');

//Report
const reportcontainer=document.querySelector('.report-container');
const report_btn = document.getElementById('report-btn');


homebtn.addEventListener('click',(event)=>{
    //location.reload();
    event.stopPropagation();
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto 20vw';
    document.querySelector(".middle").style.display='block';
    document.querySelector(".right").style.display='block';
    studyMaterial.style.display = 'none';
    msgConversation.style.display = 'none';
    groupConversation.style.display='none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});

// Show Study Material when clicking the menu
studyMaterialMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents the event from bubbling up
    studyMaterial.style.display = 'grid'; // Show the section
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    msgConversation.style.display = 'none';
    groupConversation.style.display='none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});

// Show Messages when clicking the messages menu
msgMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    msgConversation.style.display = 'grid';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    studyMaterial.style.display = 'none';
    groupConversation.style.display='none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});


grpbutton.addEventListener('click',(event) =>{
    event.stopPropagation();
    groupConversation.style.display='grid';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    msgConversation.style.display = 'none';
    studyMaterial.style.display = 'none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});


themebtn.addEventListener('click',(event) =>{
    event.stopPropagation();
    themeContainer.style.display='grid';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    groupConversation.style.display='none';
    msgConversation.style.display = 'none';
    studyMaterial.style.display = 'none';
    AskProfilePicture.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});

userpicbutton.addEventListener('click',(event) =>{
    event.stopPropagation();
    AskProfilePicture.style.display='grid';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    groupConversation.style.display='none';
    msgConversation.style.display = 'none';
    studyMaterial.style.display = 'none';
    themeContainer.style.display='none';
    Explorecontainer.style.display = 'none';
    reportcontainer.style.display = 'none';
});

Explorebtn.addEventListener('click', (event) => {
    event.stopPropagation();
    Explorecontainer.style.display = 'grid';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    studyMaterial.style.display = 'none';
    groupConversation.style.display='none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    msgConversation.style.display = 'none';
    reportcontainer.style.display = 'none';
});

report_btn.addEventListener('click', (event) => {
    event.stopPropagation();
    reportcontainer.style.display = 'block';
    document.getElementById('mainContainer').style.gridTemplateColumns = '18vw auto';
    document.querySelector(".middle").style.display='none';
    document.querySelector(".right").style.display='none';
    studyMaterial.style.display = 'none';
    groupConversation.style.display='none';
    themeContainer.style.display='none';
    AskProfilePicture.style.display='none';
    msgConversation.style.display = 'none';
    Explorecontainer.style.display = 'none';
});

// Hide Cancel when clicking outside
const postcancelbtn = document.getElementById('postcancelbtn');
const postUpload = document.querySelector('.PostUpload');

postcancelbtn.addEventListener('click', (event) => {
    event.stopPropagation();
    postUpload.style.display = 'none'
 
});


/* const SetProfilePicturebtn=document.getElementById('SetProfilePicturebtn');
SetProfilePicturebtn.addEventListener('click',(event) =>{
    event.stopPropagation();
    AskProfilePicture.style.display='none';
}); */


document.getElementById('file-search').addEventListener('input', function () {
    let searchValue = this.value.toLowerCase();
    let files = document.querySelectorAll('.file');

    files.forEach(file => {
        let fileName = file.textContent.toLowerCase();
        if (fileName.includes(searchValue)) {
            file.style.display = 'flex';
        } else {
            file.style.display = 'none';
        }
    });
});


/* document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".edit").forEach(editBtn => {
        editBtn.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevents closing when clicking inside
            
            // Close all other open menus
            document.querySelectorAll(".options-menu").forEach(menu => {
                if (menu !== this.querySelector(".options-menu")) {
                    menu.style.display = "none";
                }
            });

            let optionsMenu = this.querySelector(".options-menu");
            optionsMenu.style.display = optionsMenu.style.display === "block" ? "none" : "block";
        });
    });

    // Hide the options menu when clicking outside
    document.addEventListener("click", function () {
        document.querySelectorAll(".options-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });
}); */


document.addEventListener("click", function (e) {
    // Close all menus first
    document.querySelectorAll(".options-menu").forEach(menu => menu.style.display = "none");

    // If clicked on the toggle icon
    if (e.target.classList.contains("options-toggle")) {
        const menu = e.target.nextElementSibling;
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
        e.stopPropagation(); // Prevent click from bubbling up
    }
});



//Upload Posts
function triggerUpload() {
    document.getElementById("upload").click();
}

function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        document.querySelector('.PostUpload').style.display='block';
        const preview = document.getElementById('preview');

        // Update the preview image source
        preview.src = URL.createObjectURL(file);
    }
}

async function searchLocation(query) {
    if (query.length < 3) {
        document.getElementById('location-suggestions').innerHTML = '';
        return;
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const suggestions = data.features.map(item => `<div onclick="selectLocation('${item.properties.name}, ${item.properties.country}')">${item.properties.name}, ${item.properties.country}</div>`).join('');
        document.getElementById('location-suggestions').innerHTML = suggestions;
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

function selectLocation(location) {
    document.getElementById('location').value = location;
    document.getElementById('location-suggestions').innerHTML = '';
}


