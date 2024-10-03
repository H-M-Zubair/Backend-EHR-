# EHR Backend API

This repository contains the **Backend API** for the **Electronic Health Record (EHR) System**. It provides separate models, controllers, and routes for handling patients, doctors, appointments, and assessment forms. The backend is built with robust validation using **Joi** and **Zod**, and it supports secure authentication and interaction with the frontend via cookies.

## Features

### Core Functionality
- **User Authentication**:
  - Secure login and registration for patients and doctors.
  - Tokens are stored in **cookies** for secure authentication.
- **Separate Models and Routes**:
  - **Patient (User)**: Handles patient-related routes such as registration, login, form submission, and appointment requests.
  - **Doctor**: Handles doctor-specific functionalities, including viewing patient appointments, assessment forms, and editing them.
  - **Forms**: Patients fill out assessment forms, which doctors can review and edit.
- **Meeting Scheduling**:
  - Patients can schedule appointments with doctors.
  - **Doctor** can reschedule or modify the meeting time.
- **Assessment Form Management**:
  - Patients fill out assessment forms before meetings.
  - Doctors can access and edit the assessment forms.
- **Validation**:
  - **Joi** is used for user input validation at the model level.
  - **Zod** is used for validating form submissions, ensuring data integrity.
  
### Backend Technologies
- **Node.js with Express**: Used to build the RESTful API.
- **Joi**: For request body validation in routes such as user authentication and form submissions.
- **Zod**: For validating complex form data structures submitted by patients.
- **JWT Authentication**:
  - JWT tokens are used for secure user authentication.
  - Tokens are stored in **cookies** and passed securely between the frontend and backend.
- **Database Interaction**: Implemented with **Prisma ORM** to manage database models and queries.

## API Endpoints

### User (Patient) Endpoints
- **POST** `/api/patient/register`: Register a new patient.
- **POST** `/api/patient/login`: Log in a patient and store JWT token in cookies.
- **GET** `/api/patient/forms`: Get the list of forms filled by the patient.
- **POST** `/api/patient/forms`: Submit a new assessment form.

### Doctor Endpoints
- **GET** `/api/doctor/appointments`: View all patient appointment requests.
- **PATCH** `/api/doctor/appointments/:id/reschedule`: Reschedule a patient appointment.
- **GET** `/api/doctor/forms`: Get the list of forms submitted by patients.
- **PATCH** `/api/doctor/forms/:id`: Edit an assessment form.

### Form Endpoints
- **GET** `/api/forms`: Retrieve all forms.
- **POST** `/api/forms`: Submit new form data.
  
## Validation

- **Joi Validation**:
  - Applied to validate user authentication routes (login, register).
  - Ensures that all required fields are present and data types are correct.

- **Zod Validation**:
  - Used for **form validation** in form-related endpoints.
  - Ensures that both required and optional fields are properly handled.

## Frontend Interaction
- Data is sent to the frontend without attaching tokens in the request headers.
- **Cookies** are used to maintain session information securely.
- **React Hook Form (RHF)** and **Zod** are used on the frontend to handle form submission and validation.
- **useQuery** (React Query) is implemented on the frontend to manage API state and data fetching.

## How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/H-M-Zubair/ehr-backend.git
   cd ehr-backend
