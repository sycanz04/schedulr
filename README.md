<div align="center">
  <img src="./images/magnify128.png" alt="Schedulr Logo" width="120" />
  <h1>Schedulr</h1>
  <p>A chrome extension that transfers MMU timetable into Google, Outlook, Apple Calendar (and more)</p>

  [![License](https://img.shields.io/github/license/sycanz04/schedulr)](https://github.com/sycanz04/schedulr/blob/main/LICENSE)
  [![GitHub release](https://img.shields.io/github/v/release/sycanz04/schedulr)](https://github.com/sycanz04/schedulr/releases)
</div>

https://github.com/user-attachments/assets/b9e1409c-e5e3-4159-a5ff-86cfa49d3a7c

## Table of Content
- [Requirements](https://github.com/sycanz04/schedulr?tab=readme-ov-file#requirements-)
- [Installation](https://github.com/sycanz04/schedulr?tab=readme-ov-file#installation-)
- [Usage](https://github.com/sycanz04/schedulr?tab=readme-ov-file#usage-%EF%B8%8F)
  - [Import timetable into Google Calendar](https://github.com/sycanz04/schedulr?tab=readme-ov-file#to-import-calendar-into-google-calendar)
  - [Import timetable into other calendars](https://github.com/sycanz04/schedulr?tab=readme-ov-file#to-import-calendar-into-other-calendars-like-outlook-apple-calendar)
- [Key Binding](https://github.com/sycanz04/schedulr?tab=readme-ov-file#key-binding-%EF%B8%8F)
- [Project status](https://github.com/sycanz04/schedulr?tab=readme-ov-file#project-status-)
- [Contributing](https://github.com/sycanz04/schedulr?tab=readme-ov-file#contributing-)
- [Development Guide](https://github.com/sycanz04/schedulr?tab=readme-ov-file#development-guide-)
- [Tech Stack](https://github.com/sycanz04/schedulr?tab=readme-ov-file#tech-stack-)
- [Changelog](https://github.com/sycanz04/schedulr?tab=readme-ov-file#changelog-)
- [Privacy policy](https://github.com/sycanz04/schedulr?tab=readme-ov-file#privacy-policy-)
- [License](https://github.com/sycanz04/schedulr?tab=readme-ov-file#license-%EF%B8%8F)
- [Why this project?](https://github.com/sycanz04/schedulr?tab=readme-ov-file#why-this-project-)
- [Buy me a coffee](https://github.com/sycanz04/schedulr?tab=readme-ov-file#buy-me-a-coffee-)
- [Credit](https://github.com/sycanz04/schedulr?tab=readme-ov-file#credit-)
- [Frequently Asked Questions (FAQs)](https://github.com/sycanz04/schedulr?tab=readme-ov-file#frequently-asked-questions-faqs-)

## Requirements 👀
- MMU student with **"Active"** current student status **ONLY**.
- Chrome browser **ONLY**.

## Installation 📦
1. Go to the [extension's page](https://chromewebstore.google.com/detail/schedulr/ofaflpillnejkhmkefmcpoamjeaghipp) or search up "Schedulr" in Chrome Web Store.
2. Click "Add to Chrome".

## Usage 🕹️
Note: Some steps after step 4 may vary depending on your target calendar.

#### For students:
1. Go to **"View My Classes/Schedule > By Class"** in CliC. ***(Ensure all subjects are expanded)***

#### For lecturers:
1. Go to **"Instructor WorkCenter > My Weekly Schedule"** in CLiC.

---

2. Open the extension by using the [shortcut key](https://github.com/sycanz04/schedulr?tab=readme-ov-file#key-binding-) or by clicking the extension icon.
3. An authentication window will appear, grant permission for both scopes and then reopen the extension.

---

#### To import calendar into Google Calendar:
4. Select **Transfer to Google Calendar**, then click **Confirm**.
5. Select all the necessary options.
6. Press the **Submit** button to transfer timetable to Google Calendar.

--- 

#### To import calendar into other calendars (like Outlook, Apple Calendar):
4. Select **Download an .ics file**, then click **Confirm**.
5. Select all the necessary options.
6. Press the **Submit** button to download the .ics file.
7. Go to your target calendar and import the .ics file.

***Tip**: An .ics file lets you import events into other calendar apps like Outlook.*

## Key binding ⌨️
The shortcut key opens up the popup page
- **Linux and Windows** - `Alt+Shift+S`
- **macOS** - `Command+Shift+S`

## Project status ⏳
Schedulr version 3.0.1 is available on [Chrome Web store](https://chromewebstore.google.com/detail/schedulr/ofaflpillnejkhmkefmcpoamjeaghipp) as of now.

## Contributing 🤝🏻
Schedulr is an open-source project designed to assist fellow MMU peers. I invite you to participate in various ways to contribute and enhance the project!

Feel free to explore the [contribution guidelines](https://github.com/sycanz04/schedulr/blob/main/.github/CONTRIBUTING.md) below to get started. Your involvement is greatly appreciated!

## Development Guide 📚
### Prerequisites
- Javascript, basic web scraping knowledge
- Basic understanding of Google Calendar API
- Familiar with chrome extension development, manifest v3. Easy tutorial by google [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

### Getting Started
**Note**: This guide is based on Google Chrome's workflow, so some of the steps *(especially `manifest.json` format)* may not directly apply to other browsers. Please refer to the respective browser's documentation for more information.

#### Uploading the extension to your browser
1. **Clone the Repository**  
   ```bash
   $ git clone https://github.com/sycanz04/schedulr
   ```

2. **Prepare `manifest.json`**
   - Rename `template_manifest.json` to `manifest.json`
   - Remove the "key" and "oauth2" fields (for now).

3. **Load the Extension into Chrome**
   - Open Chrome browser and go to `chrome://extensions/`
   - Enable Developer mode (toggle switch at the top right)
   - Click on `Load unpacked` and select the cloned repository
   - The extension should now be loaded in your browser

#### Setting up Google Calendar API
1. Set Up Google Cloud Project:
    - Create a new project in the Google Cloud Console.
    - Enable the Google Calendar API.
    - Generate an OAuth 2.0 credentials (OAuth Client ID) with the application type **Chrome extension**, Item ID (can be retrieved from `chrome://extensions`).

2. Environment Configuration:
    - Add the "oauth2" fields to the `manifest.json` file and fill in the `client_id` (the one you generated) and `scopes` (remain as usual) fields.

3. Test and Contribute:
    - Test the extension by importing your timetable into Google Calendar.
    - Make changes and submit a pull request. Please follow the pull request template [here](https://github.com/sycanz04/schedulr/blob/main/.github/pull_request_template.md).

## Tech Stack 🚀
1. Javascript
2. Google calendar API
3. HTML, CSS

## Changelog 📁
Detailed changes for each release are documented in the [release notes](https://github.com/sycanz04/schedulr/releases).

## Privacy policy 📜
Please read the [Privacy Policy](https://www.mmuschedulr.com/privacy-policy.html) for this extension before proceeding.

## License ⚖️
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/sycanz04/schedulr/blob/main/LICENSE)

## Buy me a coffee ☕
I seem to have developed a bit of an addiction to espresso shots, so if you're feeling generous, feel free to [buy me a coffee](https://ko-fi.com/sycanz)!

## Credit 🎉
This project was developed at [Hackerspace MMU](https://hackerspacemmu.rocks/). Also shoutout to a couple of friends who helped me out on this project.

## Frequently Asked Questions (FAQs) 🤔
**Q: What browser does Schedulr currently support?**

**A:** Google Chrome as of now.


**Q: Do I have to pay for this extension?**

**A:** No, Schedulr is free to use for all **active** MMU students/lecturers and open-source.


**Q: Why are some of my classes not showing up in the timetable?**

**A:** Ensure you have expanded all subjects in the "By Class" page.


**Q: Do I need to grant permission every time I open the extension? And should I grant permission for both scopes in the authentication window?**

**A:** You only need to grant permission once and you're good to go. And yes you absolutely should grant permission for both scopes, otherwise the extension will not work properly.


**Q: Should I be worried about my privacy when using this extension?**

**A:** No, the extension only reads your timetable and transfers it to your calendar. It does not store any personal data.


**Q: Can I use this extension for other universities?**

**A:** No, this extension is specifically designed for MMU students and lecturers only.


**Q: Are there any plans to support other browsers?**

**A:** Maybe in the future, but for now, the focus is on Chrome.


**Q: Can I rely on this extension for my timetable?**

**A:** Somewhat, reason being CLiC might have unexpected bugs or changes that might affect the extension.


**Q: How can I contribute to this project?**

**A:** There are things like bug fixes, feature requests, code, and documentation that you can contribute to. Check out the [contribution guidelines](https://github.com/sycanz04/schedulr/blob/main/.github/CONTRIBUTING.md)


**Q: Where can I get any help or support?**

**A:** Check if the encountered issues are mentioned in this documentation. If not, you can communicate with me through [email](mailto:aidenchan0397@gmail.com), [issue tracker](https://github.com/sycanz04/schedulr/issues), or [discord](https://discordapp.com/users/340443368326692876)
