# Encore Wat Streams  
2025 ID8 Tourism Hackathon Winner @ James Cook University

<!--Badges-->
![Repository Size][repository-size-shield] ![Issue Closed][issue-closed-shield]

<!--Project Title Image-->
<img src="https://github.com/user-attachments/assets/40616797-2b3e-4d5b-bbf1-1aab695d7f10" width="1000" height="400" />

<!--Project Buttons-->
<!-- [![View Demo][view-demo-shield]][view-demo-url] [![Report bug][report-bug-shield]][report-bug-url] [![Request feature][request-feature-shield]][request-feature-url] -->

<!--Table of Contents-->
# Table of Contents
- [[1] About the Project](#1-about-the-project) 
  - [Problem Statement](#-problem-statement)
  - [Solution](#-solution)
  - [Project Members](#project-members)
- [[2] Features](#2-features)
- [[3] Technologies](#3-technologies)
- [[4] Structure Overview](#4-structure-overview)
  - [System Architecture](#system-architecture)
  - [API Specification](#api-specification)
  - [Database Diagram](#database-diagram)
- [[5] Lesson Learned](#5-lesson-learned)
  - [Schema Consistency & Team Coordination](#-schema-consistency--team-coordination)
  - [Valuable Lesson for Communication as a Project Manager](#-valuable-lesson-for-communication-as-a-project-manager)
  - [Avoiding the Classic Trap: N+1 Query Problem](#-avoiding-the-classic-trap-n1-query-problem)
- [[6] Contact](#6-contact)

# [1] About the Project
*A real-time streaming platform that brings the live Cambodian theatre experience to audiences anywhere in the world*

## ❓ Problem Statement  
Cambodian theaters have faced significant losses due to the decline in tourism caused by the COVID-19 pandemic.  
With limited opportunities to bring audiences to Cambodia, there is a need for innovative digital solutions to engage viewers virtually.  

**Challenge:**  
Create a digital platform or strategy that enables Cambodian theaters to connect with their loyal customers, generate new revenue streams, and continue cultural exchange despite travel restrictions, helping to revitalize the industry in a post-pandemic world.

## 💡 Solution  
To increase accessibility and global reach, we propose a **digital platform** that enables Cambodian theaters to **live stream** their performances.  

Audiences can:
- Purchase **virtual tickets**
- Watch shows **online** from anywhere in the world

This approach:
- Creates **new revenue streams**
- Raises **international awareness and appreciation** for Cambodian culture
- Helps **revitalize** the theater industry in a post-pandemic era

## Project Members
- Duration: 02.Jun 2025 - 20.Jun.2025
<table>
  <tbody>
    <tr>
      <td align="center"><img src="https://github.com/NiceKim.png" width="150px;" alt="NiceKim"/></td>
      <td align="center"><img src="https://github.com/Dajin-01.png" width="150px;" alt="Bloxvin"/></td>
      <td align="center"><img src="https://github.com/ivy-naw-mth.png" width="150px;" alt="ivy-naw-mth"/></td>
      <td align="center"><img src="https://github.com/dulari-hasini-gammampila.png" width="150px;" alt="dulari-hasini-gammampila"/></td>
      <td align="center"><img src="https://github.com/TinNilarSoe.png" width="150px;" alt="TinNilarSoe"/></td>
    </tr>
      <tr>
      <td align="center">Jowoon Kim<br> <a href="https://github.com/NiceKim">@NiceKim</a></td>
      <td align="center">Dajin Kim<br> <a href="https://github.com/Dajin-01">@Dajin-01</a></td>
      <td align="center">Naw Ivy May Thu Han<br> <a href="https://github.com/ivy-naw-mth">@ivy-naw-mth </a></td>
      <td align="center">Dulari Hasini Gammampila<br> <a href="https://github.com/dulari-hasini-gammampila">@dulari-hasini-gammampila </a></td>
      <td align="center">Tin Nilar Soe<br> <a href="https://github.com/TinNilarSoe">@TinNilarSoe </a></td>
     </tr>
      <tr>
      <td align="center">Project Manager/<br> Backend Developer:Streaming </td>
      <td align="center">Backend Developer:API</td>
      <td align="center">Backend Developer:Database</td>
      <td align="center">Frontend Developer</td>
      <td align="center">Frontend Developer</td>
     </tr>
  </tbody>
</table>

# [2] Features
- User Management: Two user roles — Audience and Theater — with distinct permissions.
- Streaming: Real-time livestream with WebRTC and reaction chat.
- Booking Management: Audience can book shows through the platform.
- Show Management: Theaters (Directors) can create and manage show schedules.
- Payment Integration: Secure payments via PayPal.

<table>
  <tbody>
    <tr> <td align="center"><b>HomePage</b></td> </tr>
    <tr> <td align="center"><img src="https://github.com/user-attachments/assets/383572d3-4753-43ec-8462-e747506fdab3" width="600px" height="400px" alt="HomePage"></td> </tr>
    <tr> <td align="center"><b>Bookings</b></td> </tr>
    <tr> <td align="center"><img src="https://github.com/user-attachments/assets/9b637ab0-a59b-42b2-8112-9fd7fe465863" width="600px" height="400px" alt="Booking"></td> </tr>
    <tr> <td align="center"><b>Streaming</b></td> </tr>
    <tr> <td align="center"><img src="https://github.com/user-attachments/assets/8ca21b69-a427-42d1-9454-7cc8a37c0bfe" width="600px" height="400px" alt="Streaming"></td> </tr>
  </tbody>
</table>

# [3] Technologies

### Frontend
![HTML](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
### Backend
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
<img src="https://img.shields.io/badge/webrtc-333333?style=for-the-badge&logo=html5&logoColor=white">
### API & Documentation
<img src="https://img.shields.io/badge/REST API-527FFF?style=for-the-badge&logo=&logoColor=white"> ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
### Tools
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

# [4] Structure Overview

## System Architecture
![Image](https://github.com/user-attachments/assets/52076856-7030-477e-9a46-166e8c23c617)
> If deployed at scale: Proposed scalable cloud architecture

## API Specification
![Image](https://github.com/user-attachments/assets/6d552855-5791-4f4c-a50a-8cd3193d1a73)

## Database Diagram
![Image](https://github.com/user-attachments/assets/fa9e8d57-3d7c-466a-892a-3dece52d33e7)

# [5] Lesson Learned
## 🛠 Schema Consistency & Team Coordination  
**👤 Author: Ivy**
> ### Issue
> As the backend developer responsible for designing and managing the MySQL database layer, I encountered repeated errors due to inconsistent naming conventions when accessing database fields across different parts of the codebase.  
> As new features were added and schema changes occurred, it became difficult to track updates, resulting in confusion and broken queries.
> ### Solution
> To address this, I introduced a shared schema documentation file and established clear naming conventions for all contributors. 
> I also refactored the existing schema to reflect evolving requirements more accurately and reduce ambiguity in field names.
> ### Lesson Learned
> This experience taught me the critical importance of schema consistency and proactive communication in team-based backend development.  
> I also learned to anticipate future changes by designing flexible and well-documented database schemas that support team scalability.

## 📝 Valuable Lesson for Communication as a Project Manager  
**👤 Author: Jowoon Kim**
> ### Issue
> During a time-constrained hackathon, two major issues affected team efficiency. <br>
> **Team Experience Diversity**  
> Some teammates were newer to project-based development, which created opportunities for mentorship and required extra clarity in task delegation and technical guidance. <br>
> **Communication Gaps**  
>   Inconsistencies in API routes and variable names caused frequent bugs and delayed development.  
>   Frontend developers were also often blocked while waiting for backend endpoints to be completed.
> ### Solution
> **Task Breakdown & Prioritization**  
> Took a full day to identify all key features, assess difficulty, and distribute tasks clearly based on team capacity. <br>
> **Knowledge Sharing & Pair Programming**  
> Held online/offline pair programming sessions to guide developers through challenges, gradually enabling them to work autonomously.
> **Standardization for Smooth Collaboration**  
>   Created API documentation and a shared database diagram to enforce consistent data structures.  
>   Deployed a test server returning mock data so frontend and backend could develop in parallel without dependency issues.
> ### Lesson Learned
> I learned that investing time in mentoring and clear communication is essential—even if it requires extra effort—because it builds team confidence and reduces bottlenecks. 
> Effective task planning and early standardization significantly reduce confusion and rework in fast-paced projects, ultimately leading to a successful outcome.

## 🪤 Avoiding the Classic Trap: N+1 Query Problem 
**👤 Author: Jowoon Kim**
> ### Issue
> During a post-hackathon code review, I discovered an inefficiency I had previously overlooked.
> It was found in the feature that requests data for currently streaming shows.
> To implement this, I needed to query the schedules table for rows where is_streaming = 1, and then fetch the corresponding show details from the shows table.
> In the initial implementation, I used two separate functions:
> **getStreamingSchedules**: fetched schedules where is_streaming = 1
> **getShowById**: fetched show details for each schedule individually
> This approach was easy to understand but inefficient. It caused multiple database calls—one for the schedules and one for each show—resulting in an N+1 query problem.
> Although Promise.all was used to handle the requests concurrently, the number of queries still scaled with the number of schedules, increasing DB load.
> ### Solution
> I rewrote the logic using a single JOIN query to fetch all required data in one call.
> This avoided redundant queries and significantly improved performance.
> In effect, I replaced manual per-item fetching with eager loading via SQL JOIN.
> ### Lesson Learned
> Although my original code was straightforward, a bit more thought would have revealed its flaws.
> Rather than jumping straight into implementation, I’ve realized the importance of considering scalability, efficiency, and reusability from the start.
> Learning from common pitfalls like the N+1 problem can help me avoid similar mistakes in the future.
> I believe this mindset is essential for growing as a better developer.

# [6] Contact
If you want to contact me, you can reach me at:
- 📧 96nicekim@gmail.com
- 📋 [https://www.linkedin.com/in/jowoon-kim-424943119/](https://www.linkedin.com/in/jowoon-kim-424943119/)



<!--Url for Badges-->
[repository-size-shield]: https://img.shields.io/github/repo-size/NiceKim/Encore-Wat-Streams?labelColor=D8D8D8&color=BE81F7
[issue-closed-shield]: https://img.shields.io/github/issues-closed/NiceKim/Encore-Wat-Streams?labelColor=D8D8D8&color=FE9A2E

<!--Url for Buttons-->
[view-demo-shield]: https://img.shields.io/badge/-%F0%9F%98%8E%20view%20demo-F3F781?style=for-the-badge
[view-demo-url]: https://github.com/NiceKim/Encore-Wat-Streams
[report-bug-shield]: https://img.shields.io/badge/-%F0%9F%90%9E%20report%20bug-F5A9A9?style=for-the-badge
[report-bug-url]: https://github.com/NiceKim/Encore-Wat-Streams/issues
[request-feature-shield]: https://img.shields.io/badge/-%E2%9C%A8%20request%20feature-A9D0F5?style=for-the-badge
[request-feature-url]: https://github.com/NiceKim/Encore-Wat-Streams/issues
