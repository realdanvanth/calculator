# 23CSE461 - FULL STACK FRAMEWORKS
## Lab Assignment Document

---

**Name:** Danvanth S C  
**Roll No:** CB.SC.U4CSE23241  
**GitHub URL:** https://github.com/realdanvanth

---

## Course Information

### Unit I - React JS
Creating and using components, bindings, props, states, events, Working with components, Conditional rendering, Building forms, Getting data from RESTful APIs, Routing, CRUD with Firebase, Redux, React and Redux, Function vs. class based components, Hooks.

### Unit II - Express JS
Node JS – Basics, setup, console, command utilities, modules, events, Express JS – Routing, HTTP methods, CSS, Bootstrap, JavaScript, React, Redux, Node, Express, URL building, Templates, Static files, Form data, Database, Cookies, Sessions, Authentication, RESTful APIs, Scaffolding, Error handling, Debugging.

### Unit III - Mongo DB
Mongo DB ecosystem, Importing and Exporting data, Mongo query language, Updating documents, Aggregation framework, System and user generated variables, Schema validation, Data modelling, Indexing, Performance.

---

## Course Objectives
- Web development has become easier with the introduction of frameworks.
- It has also paved the way for full stack web development.
- Full-stack developers use frameworks to develop, optimize and maintain websites and other web applications.
- This course covers some of the important full stack frameworks.

## Course Outcomes
- **CO1:** Learn how to develop single page applications (SPAs) efficiently using front-end framework.
- **CO2:** Learn to use backend frameworks to develop web and mobile applications robustly.
- **CO3:** Learn to build highly available and scalable internet applications using document databases.
- **CO4:** Design and develop full stack web projects using front-end, back-end and database frameworks.

---

## List of Exercises

| Sl.No | Ex.No. | Date | Title of the Experiments | Page No. |
|-------|--------|------|--------------------------|----------|
| 1 | 1 | 16/01/26 | ReactJS Program to Find Factorial, Fibonacci Series and Prime Number | 3 |
| 2 | 2 | 16/01/26 | ReactJS Program to Find Sum of Digits of a Number | 4 |
| 3 | 3 | 17/01/26 | ReactJS Employee Tax Calculator (SET–1) | 5 |
| 4 | 4 | 17/01/26 | ReactJS Scientific Calculator Program | 6 |
| 5 | 5 | 17/01/26 | ReactJS Calculator with Game Concept for Kids | 7 |

---

## EX.NO.: 1

### AIM:
To design a ReactJS-based application that determines whether a number is prime, computes the factorial of a given number, and generates a Fibonacci sequence for a specified length.

**GitHub:** https://github.com/realdanvanth/23CSE461/tree/main/exp01

### LIST OF FILE NAMES WITH ITS PURPOSE

| FileName | Purpose |
|----------|---------|
| index.html | The HTML file that acts as entry point for the application. |
| main.jsx | The Main application file that contains the react code from all the components |
| App.jsx | The component that contains the logic for all the three calculators |
| App.css | The file that contains the styling for all the elements in App.jsx |

### CONCEPTS USED IN THE APPLICATION

| Concept Name | General Purpose | Code file where it is used |
|--------------|-----------------|---------------------------|
| useState | To store and update the values entered by the user, for further calculation | App.jsx |
| Functional Components | For constructing UI components, while offering a simpler, more readable, and performant way to build applications. | App.jsx |
| Event Handling | Event Handling function to be called based on user behaviour like clicking buttons or changing values in a field. | App.jsx |
| Conditional Rendering | To decide which element to be exactly rendered based on some state or user input from drop-down box. | App.jsx |

### OUTPUT:
**Live Demo:** https://realdanvanth.github.io/23CSE461/exp01/

---

## EX.NO.: 2

### AIM:
To create a ReactJS application for calculating the sum of digits entered by the user.

**GitHub:** https://github.com/realdanvanth/23CSE461/tree/main/exp02

### LIST OF FILE NAMES WITH ITS PURPOSE

| FileName | Purpose |
|----------|---------|
| index.html | The HTML file that acts as the entry point for the application. |
| main.jsx | The main application file that contains the react code from all the components |
| App.jsx | The component that contains the logic for calculation of sum of digits along with UI for it. |
| App.css | The file that contains the styling for all the elements in App.jsx |

### CONCEPTS USED IN THE APPLICATION

| Concept Name | General Purpose | Code file where it is used |
|--------------|-----------------|---------------------------|
| useState | To store and update the values based on user input | App.jsx |
| Event Handling | To call functions based on user behaviour like clicking buttons or changing values in a field. | App.jsx |
| Functional Components | For constructing UI components, while offering a simpler, more readable, and performant way to build applications. | App.jsx |
| Helper Functions | To improve code organization, readability, and maintainability | App.jsx |
| Conditional Rendering | To decide which element to be exactly rendered based on some state or user input from drop-down box. | App.jsx |

### OUTPUT:
**Live Demo:** https://realdanvanth.github.io/23CSE461/exp02/

---

## EX.NO.: 3

### AIM:
To design and develop an Employee Tax Calculator using ReactJS that calculates the total salary based on Basic Pay, determines the employee grade, and computes the bonus according to predefined conditions.

**GitHub:** https://github.com/realdanvanth/23CSE461/tree/main/exp03

### LIST OF FILE NAMES WITH ITS PURPOSE

| FileName | Purpose |
|----------|---------|
| index.html | The HTML file that acts as the entry point for the application. |
| main.jsx | The main application file that renders the React root component |
| App.jsx | The component that contains the logic for calculating total salary, employee grade, and bonus based on Basic Pay. |
| App.css | The file that contains the styling for all UI elements in the application. |

### CONCEPTS USED IN THE APPLICATION

| Concept Name | General Purpose | Code file where it is used |
|--------------|-----------------|---------------------------|
| useState | To store and update Basic Pay, Total Salary, Grade, and Bonus values dynamically. | App.jsx |
| Functional Components | To construct reusable UI components using a simple and readable approach. | App.jsx |
| Event Handling | To trigger salary calculation, grade checking, and bonus computation through button clicks. | App.jsx |
| Conditional Rendering | To display salary, grade, and bonus only after user interaction. | App.jsx |
| Helper Functions | To calculate allowances, total salary, grade, and bonus in a structured manner. | App.jsx |

### OUTPUT:
**Live Demo:** https://realdanvanth.github.io/23CSE461/exp03/

---

## EX.NO.: 4

### AIM:
To design and implement a scientific calculator application using ReactJS that performs both basic arithmetic and advanced mathematical operations.

**GitHub:** https://github.com/realdanvanth/23CSE461/tree/main/Calculator

### LIST OF FILE NAMES WITH ITS PURPOSE

| FileName | Purpose |
|----------|---------|
| index.html | The HTML file that acts as the entry point for the application. |
| main.jsx | The main application file that contains the react code from all the components |
| App.jsx | The component that contains the logic for all the available operators and settings in the calculator |
| App.css | The file that contains the styling for all the elements in App.jsx |

### CONCEPTS USED IN THE APPLICATION

| Concept Name | General Purpose | Code file where it is used |
|--------------|-----------------|---------------------------|
| useState | To store and update the values based on user input | App.jsx |
| Functional Components | For constructing UI components, while offering a simpler, more readable, and performant way to build applications. | App.jsx |
| Helper Functions | To improve code organization, readability, and maintainability | App.jsx |
| Event Handling | To call functions based on user behaviour like clicking buttons or changing values in a field. | App.jsx |
| Conditional Rendering | To decide which element to be exactly rendered based on some state or user input from drop-down box. | App.jsx |

### OUTPUT:
**Live Demo:** https://realdanvanth.github.io/23CSE461/calculator/

---

## EX.NO.: 5

### AIM:
To design and implement a gamified calculator application using ReactJS that provides an interactive and child-friendly environment for performing basic arithmetic operations.

**GitHub:** https://github.com/realdanvanth/23CSE461/tree/main/exp05

### LIST OF FILE NAMES WITH ITS PURPOSE

| FileName | Purpose |
|----------|---------|
| index.html | The HTML file that acts as the entry point for the application. |
| main.jsx | The main application file that contains the react code from all the components |
| App.jsx | The component that contains the logic for both a fun game and a basic calculator that can be used by kids. |
| App.css | The file that contains the styling for all the elements in App.jsx |

### CONCEPTS USED IN THE APPLICATION

| Concept Name | General Purpose | Code file where it is used |
|--------------|-----------------|---------------------------|
| useState | To store and update the values based on user input | App.jsx |
| useEffect | For handling side effects in functional components | App.jsx |
| useRef | To persist mutable values across component re-renders without causing the component to re-render when the value changes | App.jsx |
| useCallback | To memoize a function, returning the same function instance across re-renders unless its dependencies change | App.jsx |
| Functional Components | For constructing UI components, while offering a simpler, more readable, and performant way to build applications. | App.jsx |
| Helper Functions | To improve code organization, readability, and maintainability | App.jsx |

### OUTPUT:
**Live Demo:** https://realdanvanth.github.io/23CSE461/exp05/

---
