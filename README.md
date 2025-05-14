
# 🎓 CampusConnect – A Web-Based Social Media Platform for Students

**CampusConnect** is a real-time, role-based social media platform designed specifically for academic institutions. Built using HTML, CSS, and JavaScript, with Firebase and Cloudinary on the backend, it enables seamless interaction between students and staff for sharing posts, academic files, submitting reports, and more.

---

## 🚀 Features

- 📸 Post images 
- 🗂️ Upload and download study materials (staff only)
- 📝 Student report submission module
- 💬 Real-time messaging between users (followers/following)
- 🛎️ Notifications stored per user node
- 🌍 Location tagging with OpenStreetMap + Photon API
- 🔐 Role-based access (Student / Staff)
- 📱 Responsive design for mobile and desktop

---

## 🧰 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | HTML, CSS, JavaScript              |
| Realtime DB | Firebase Realtime Database         |
| Media       | Cloudinary API                     |
| Location    | OpenStreetMap, Nominatim/Photon API |
| Hosting     | Firebase Hosting / GitHub Pages    |

---

## 🏗️ Project Structure

```
/public
  ├── index.html
  ├── style.css
  ├── app.js
  ├── /images
  ├── /reels
/screenshots
/firebase.json
README.md
```

---


 📷 Screenshots


- Login Page
![Screenshot 2025-04-20 173059](https://github.com/user-attachments/assets/0a8f1290-8ed5-422e-809d-7dd7cc3d90ba)
- Student Dashboard
![Screenshot 2025-04-25 114204](https://github.com/user-attachments/assets/ed88943a-bf82-47a6-9023-4ddf916d2109)

- Staff Material Upload
![Screenshot 2025-04-20 173311](https://github.com/user-attachments/assets/1ad6fd6c-9e6e-48cf-9e1d-eae77d2f7146)


- Chat Interface
![Screenshot 2025-04-20 173251](https://github.com/user-attachments/assets/021dad3a-22f1-4cdb-ba6d-8336e96df2a3)

- Profile Page
![Screenshot 2025-04-20 173335](https://github.com/user-attachments/assets/fe24cc43-11cf-4e2f-aab4-fe7d15bd370c)

---

## 🔐 Firebase Data Model (JSON)

```json
{
  "users": {
    "21MCA001": {
      "name": "Vishnu",
      "role": "student",
      "profilePic": "https://..."
    }
  },
  "posts": {
    "post001": {
      "userId": "21MCA001",
      "caption": "Welcome!",
      "mediaUrl": "https://...",
      "timestamp": 123456789
    }
  }
}
```

---


## 📜 License

This project is for academic purposes. Commercial use is not permitted without permission.
