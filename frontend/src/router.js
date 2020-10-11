import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CategoryContainer from './containers/Dashboard/Category';
import QuizContainer from './containers/Dashboard/Quiz';
import UserContainer from './containers/Dashboard/User';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AuthResetPassword from './pages/auth/resetpassword';
import DashBoard from './pages/Dashboard';
import Test from './pages/QuizTest';
import Home from './pages/Index';
import QuestionContainer from './containers/Dashboard/Questions';
import Category from './pages/Category';
import Profile from './containers/Dashboard/Profile';
import SubCategoryContainer from './containers/Dashboard/SubCategory';
import SubjectContainer from './containers/Dashboard/Subject';
import SubCategory from './pages/SubCategory';
import Subject from './pages/Subject';


export const RouteWrapper = props => {
    return (<Router>
        <Route exact path="/dashboard/subject" component={SubjectContainer} />
        <Route exact path="/dashboard/subCategory" component={SubCategoryContainer} />
        <Route exact path="/dashboard/category" component={CategoryContainer} />
        <Route exact path="/dashboard/question" component={QuestionContainer} />
        <Route exact path="/dashboard/quiz" component={QuizContainer} />
        <Route exact path="/admin/user" component={UserContainer} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="/quiz/:id" component={Test} />
        <Route exact path="/subject/:id" component={Subject} />
        <Route exact path="/sub-category/:id" component={SubCategory} />
        <Route exact path="/category/:id" component={Category} />
        <Route exact path="/sub-category" component={SubCategory} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/resetpassword/:resettoken" component={AuthResetPassword} />
        <Route exact path="/register" component={AuthRegister} />
        <Route exact path="/login" component={AuthLogin} />
        <Route exact path="/" component={Home} />
    </Router>)
}