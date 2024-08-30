# Schedulr 📅
Google chrome extension that extracts timetable from the "My Weekly Schedule" page of **MMU CliC** and automatically creates recurring events in Google Calendar, effectively transferring your schedule from CliC to Google Calendar.

https://github.com/user-attachments/assets/9379bee7-6b2d-48c0-b261-4f93800fcac5

## Table of Content
- [Requirements](https://github.com/sycanz04/schedulr?tab=readme-ov-file#requirements-)
- [Installation](https://github.com/sycanz04/schedulr?tab=readme-ov-file#installation-)
  - [Easy Installation](https://github.com/sycanz04/schedulr?tab=readme-ov-file#easy-installation-)
  - [Manual Installation](https://github.com/sycanz04/schedulr?tab=readme-ov-file#manual-installation-)
- [Usage](https://github.com/sycanz04/schedulr?tab=readme-ov-file#usage-)
- [Key Binding](https://github.com/sycanz04/schedulr?tab=readme-ov-file#key-binding-)
- [Project status](https://github.com/sycanz04/schedulr?tab=readme-ov-file#project-status-)
- [Tech Stack](https://github.com/sycanz04/schedulr?tab=readme-ov-file#tech-stack-)
- [Why this project?](https://github.com/sycanz04/schedulr?tab=readme-ov-file#why-this-project-)
- [Privacy policy](https://github.com/sycanz04/schedulr?tab=readme-ov-file#privacy-policy-)
- [Buy me a coffee](https://github.com/sycanz04/schedulr?tab=readme-ov-file#buy-me-a-coffee-)
- [Credit](https://github.com/sycanz04/schedulr?tab=readme-ov-file#credit-)

## Requirements 👀
Any MMU student with **"Active"** current student status and a chrome browser

## Installation 📦
### Easy installation (Not available as of this moment, [see why](https://github.com/sycanz04/schedulr?tab=readme-ov-file#project-status-))
1. Open [Chrome Web Store](https://chromewebstore.google.com/?utm_source=ext_app_menu&pli=1)
2. Search for "Schedulr"
3. Click "Add to Chrome"

### Manual installation
**Note:** *Using this method will require you to manually clone the project everytime an update is made to this project*
1. Clone git project
2. Create a new google cloud project
3. Setup OAuth Consent Screen with "salendar" and "salendar.event" scopes
4. Create a OAuth Client ID
5. Enable Google Calendar API for the project
6. Replace the "client_id" field in **manifest.json**
7. Go to your [chrome extension](chrome://extensions/)
8. Click on "Load Unpacked" and load the cloned project

After you're done with the installation, follow [Usage](https://github.com/sycanz04/schedulr?tab=readme-ov-file#usage-)

## Usage 🕹️
1. Go to your CliC's "My Weekly Schedule" page (***Make sure you're on the very first week of the semester***)
2. Click on the extension, select short (7 weeks) or long (14 weeks) semester.
3. Click submit button.
4. Classes should be added to Google Calendar.

## Key binding ⌨️
- `Alt+Shift+S` - Opens extension page

## Project status ⏳
Currently the extension is available on [Chrome Web store](https://chromewebstore.google.com/detail/schedulr/ofaflpillnejkhmkefmcpoamjeaghipp) but my OAuth Consent Screen is in the process of being authenticated.
So the only way to use it right now is to clone the project manually and set up your own extension.

## Tech Stack 🚀
1. Javascript
2. Google API

## Why this project? 🛌
Imagine a world where you can automate your life - cool right? I initially created this to save time on manually transferring my timetable but it seems I've spend more time building it than I would have transferring the timetable manually...oh well.

Since this is my first web project, I'd love to hear any suggetions for improvements you might have!

## Privacy policy 📜
Please read the [Privacy Policy](https://www.mmuschedulr.com/privacy-policy.html) for this extension before proceeding.

## Buy me a coffee ☕
I seem to have developed a bit of an addiction to espresso shots, so if you're feeling generous, feel free to [buy me a coffee](https://ko-fi.com/sycanz)!

## Credit 🤝🏻
This project was developed at [Hackerspace MMU](https://hackerspacemmu.rocks/). Also shoutout to a couple of friends who helped me out on this project.
