<div align="center">

# GymBrah

Build better tiny habits to get fit and healthy.

[💬 Discord](https://discord.gg/)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[🚀 Join](https://www.gymbrah.com)

</div>

## Database Flow

This graph shows the interaction between tables, especially focusing on the athlete onboarding process with the athlete_code system.

+--------------------+ +--------------------+
| business | | athlete |
|--------------------| |--------------------|
| id (UUID) | | id (UUID) |
| user_id (FK) | | user_id (FK) |
| name | | athlete_code (U) |
+--------+-----------+ | invited_by (FK) |
| | email |
| | phone |
| +--------------------+
| ▲
| Registers Athlete |
| |
| |
+--------+---------+ +--------------------+
| user | | workout |
|------------------| |--------------------|
| id (UUID) | | id (UUID) |
| email (U) | | name |
| full_name | | user_id (FK) |
| avatar_url | | athlete_id (FK) |
| created_at | | selected |
+--------+---------+ +--------+-----------+
▲ ▲
| |
| |
| Athlete Signs Up |
| |
+--------------------+ +--------------------+
| waitlist | | workout_athlete |
|------------------ | |--------------------|
| id (UUID) | | id (UUID) |
| email (U) | | workout_id (FK) |
| created_at | | athlete_id (FK) |
+--------------------+ | business_id (FK) |
+--------------------+

## 📌 How the Flow Works

1️⃣ A Gym Registers an Athlete
• Creates a new athlete with a unique athlete_code.
• Sends an invite email/SMS with the code.

2️⃣ The Athlete Signs Up
• If the email matches an existing invite, the user is linked automatically.
• Otherwise, they can manually enter the athlete_code to get associated.

3️⃣ Workout Assignment & Tracking
• The workout_athlete table links workouts to athletes.
• The gym can assign workouts even before the athlete signs up.
