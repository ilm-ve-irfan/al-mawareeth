# Al-Mawareeth: Islamic Inheritance Calculator - First Design Document

**Project**: Al-Mawareeth (Islamic Inheritance Calculator)  
**Target Users**: 100-1000 users  
**Platforms**: Web, Android, iOS  
**Architecture**: Microservices-based Backend  
**Date**: May 2026

---

## 1. Executive Summary

Al-Mawareeth is a cross-platform application designed to calculate inheritance distribution according to Islamic law. The system uses a role-based chatbot to gather user information and maintain per-user sessions. The architecture follows a microservices pattern with a shared backend serving web, Android, and iOS clients.

### Key Goals
- Provide accurate Islamic inheritance calculations
- Deliver a seamless experience across all platforms
- Ensure user data privacy and session management
- Enable future scalability and feature additions

---

## 2. System Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                     Client Layer                           │
├──────────────────┬──────────────────┬──────────────────────┤
│   Web Browser    │   Android App    │    iOS App           │
│  (React/Vue)     │  (Native/React   │   (Swift/React       │
│                  │   Native)        │   Native)            │
└──────────────────┴──────────────────┴──────────────────────┘
                           │
                           │ REST API (HTTPs)
                           │
┌─────────────────────────────────────────────────────────────┐
│              API Gateway / Load Balancer                    │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────────┐ ┌─────▼────────┐ ┌───────▼─────────┐
│  Auth Service    │ │ Chatbot      │ │ Inheritance     │
│  - Login/Signup  │ │  Service     │ │  Calculator     │
│  - JWT Tokens    │ │  - Q&A       │ │  Service        │
│  - Sessions      │ │  - Form      │ │  - Calculations │
│                  │ │    Management│ │  - Validation   │
└──────────────────┘ └──────────────┘ └─────────────────┘
        │                  │                  │
┌───────┴──────────────────┴──────────────────┴────────────┐
│                     Data Layer                           │
├──────────────────┬──────────────────┬────────────────────┤
│                       Database                           │
│                      (PostgreSQL)                        │          
└──────────────────┴──────────────────┴────────────────────┘
```
---