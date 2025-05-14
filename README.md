## QCTrack – Digital Quality Control and Non-Conformance System

I developed **QCTrack**, a digital quality control system tailored for a lighting manufacturing company to **log, manage, and analyze product non-conformance issues**, whether identified internally or returned from the field. The platform streamlined issue tracking, accountability, and root cause analysis, significantly improving traceability and process improvement efforts.

### Key Features

- **Issue logging interface** for relevant staff to report non-conformances:

  - Attach **images** and provide detailed **descriptions**.
  - Select from a predefined list of **common fault categories** for consistent classification and future analysis.
  - Identify the **responsible department** (e.g., Technical, Mechanical Design, Production).

- **Automated email notifications** sent to the assigned individuals within the responsible department, including fault details and images.

- **Root cause analysis workflow**:

  - Responsible parties provide **cause investigation**, **preventative measures**, and **cost tracking** (e.g., replacement components).
  - Issues can be attributed to **categories** such as _supplier error_ or _production procedure fault_.
  - If supplier-related, their details are logged for follow-up.

- **Issue closure validation** ensures that all required fields are completed before an issue can be marked resolved.

- **Auto-generated QC reports**:

  - Upon closure, a **PDF report** is automatically created and emailed to the original reporter.
  - Includes all relevant data, including **client information** for traceability and customer communication.

- **Interactive analytics dashboard**:
  - Filter and visualize data to identify trends by **product**, **fault type**, or **supplier**.
  - Interactive bar charts allow users to click on a product or category to view associated issues.
  - Used actively in **QC meetings** and **ISO audits** to demonstrate issue resolution processes and trend tracking.

Built with a stack including **Nuxt.js**, **Node.js**, **MySQL**, and an integrated **SMTP email service**, QCTrack became a core part of the company's quality assurance and continuous improvement strategy.

![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![SMTP Email](https://img.shields.io/badge/SMTP%20Email-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
