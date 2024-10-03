import express, { Router, Request, Response, NextFunction } from 'express';
import { userLoginValidation, userRegisterValidation } from '../utils/userValidation';
import {  getAuthenticatedUser, getUserById, getUsers, loginUser, logoutUser, registerUser } from '../controllers/UserController';
import { doctorLoginValidation } from '../utils/doctorValidation';
import { getAllUsersForDoctor, getAuthenticatedDoctor, loginDoctor, logoutDoctor, registerDoctor } from '../controllers/DoctorController';
import {  deleteForm,  getAllForms,  getFormByFormId, getUserAndPatientForms, storeFormData, updateFormByFormId, } from '../controllers/PatientFormController';
// import { registerUser, loginUser, getUsers, getAuthenticatedUser } from '../controllers/usercontroller';
// import { userRegisterValidation, userLoginValidation } from '../utils/userValidation';
// import ensureAuthenticated from '../utils/auth';

const routes: Router = express.Router();

// API's User
routes.post('/register', userRegisterValidation, registerUser);
routes.post('/login', userLoginValidation, loginUser);
routes.get('/auth/user', getAuthenticatedUser);
routes.post('/logout', logoutUser);
routes.get('/get-user-by-id/:id',getUserById);

// API's Register Doctor
routes.post('/register-doctor',doctorLoginValidation,registerDoctor);
routes.post('/login-doctor',doctorLoginValidation,loginDoctor);
routes.get('/get-users',getAllUsersForDoctor);
routes.get('/auth/doctor',getAuthenticatedDoctor);
routes.post("/logout-doctor",logoutDoctor);


//API's for forms
routes.post('/store-patient-form', storeFormData);
routes.get('/get-patients-form-by-patientId/:id',getUserAndPatientForms);
routes.get('/get-patient-form-by-formId/:id',getFormByFormId);
routes.post('/update-form-data-by-form-id/:id',updateFormByFormId);
routes.delete('/delete-form-by-form-id/:id',deleteForm);
routes.get('/get-assessment-forms',getAllForms)

export default routes;
