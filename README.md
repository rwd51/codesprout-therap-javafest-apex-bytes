
![d52f2188-6960-4397-8bbb-fd08c3edd976](https://github.com/user-attachments/assets/7b396842-3ac0-4fcd-b809-aa0428d133bd)

# **CodeSprout**

**An AI Powered Digital Playground Where Education Meets Imagination**

## **Overview**
The CodeSprout is a solution that uses AI to transform children's learning experience into a more gamified and exciting one. It stands as a beacon of hope, showcasing how AI can be harnessed to address the complex relationship between children and technology in today's digital age.

## **Key Points of CodeSprout**:
1. **Conventional Learning**: Problem Solving using Blocks
2. **Creative Learning**: Learning with interactive projects
3. **Interactive**: Solving problems with visualization and help from AI
4. **Scalable Structure**: Microservice in Java

## **Features**

### **1. Block-Based Learning**
   - **Block-Based Projects**: Children engage in creative learning through fun, block-based projects.
   - **Block-Based Problem Solving**: Gamified learning experience with block-based problem-solving challenges.

### **2. Gamified Interface**
   - **Gamified Learning Experience**: The platform provides a gamified interface where children can interact with educational content in a fun and engaging way.
   - **Statistics and Accomplishments**: Children's progress and accomplishments are displayed in a gamified manner, offering rewards and milestones to keep them motivated.

### **3. Chatbot**
   - **AI-Based Recommendation**: Personalized recommendations for learning activities powered by AI.

### **4. Parental Involvement**
   - **Connected with Parents**: Seamless connection with parents to keep them updated on their child's learning journey.
   - **Parents Monitoring Progress**: Parents can monitor their child’s progress and receive a comprehensive PDF report.

### **5. Automated Project Generation**
   - **Automated Project Creation**: Automatically generates new and exciting projects tailored to the child's progress and learning curve.

## **System Architecture**

This microservice-based project comprises seven core services: **UserService**, **ParentService**, **ChatbotService**, **CodingAssistantService**, **RecommendationService**, **ParentService**, and **ProblemService**. Each service is hosted on separate servers to ensure scalability and optimal performance. Additionally, two essential modules, the **Gateway** and **Discovery Server**, are employed for inter-service communication and load balancing.

### **Service Responsibilities**
- **UserService**: Manages user authentication, profile management, and user-related data storage.
- **ParentService**: Enables parental control, progress tracking, and generates progress reports in PDF format.
- **ChatbotService**: Handles the chatbot functionality, providing AI-based interactions and suggestions.
- **CodingAssistantService**: Assists children in their coding activities, offering real-time feedback and help.
- **RecommendationService**: Generates AI-based learning recommendations based on user interaction and progress.
- **ProblemService**: Manages problem-solving tasks, tracks user progress, and gamifies problem challenges.
- **Gateway and Discovery Server**: The **Gateway** handles routing and traffic control 
between services, while the **Discovery Server** manages service registration and load balancing across microservices.

<img width="1414" alt="Screenshot 2024-09-26 at 12 48 11 AM" src="https://github.com/user-attachments/assets/a70ed355-06c0-4c1b-a039-a0c00655d4d0">

The following diagram visually represents the end-to-end flow of the project.

<img width="622" alt="Screenshot 2024-09-26 at 3 54 07 AM" src="https://github.com/user-attachments/assets/a01c33d7-3221-4bf6-bab9-4e5c1b96da1a">

## **Technology Stack**

| **Component**              | **Technologies**                                                                 |
|----------------------------|----------------------------------------------------------------------------------|
| **Frontend**               | React, Redux, MaterialUI                                                               |
| **Backend**                | Java Spring Boot, Spring Cloud Netflix Eureka, Spring Cloud Gateway, Spring Security |
| **Database & Storage**     | MongoDB, Firebase Storage (for PDFs and Images)                                   |
| **CSS Framework & Design** | Tailwind CSS (Framework), Canva (Design Tool)                                     |
| **AI Models**              | GPT-3.5-turbo (Text), [AutoDraw API wrapper](https://github.com/engelsjk/python-test-googledraw-api)(Image Generation)|
| **Speech-related**         | React-speech-recognition (Speech to Text), React-Speech-Synthesis (Text to Speech)|
| **AI Recommendation Service**| Recombee                                                                          |
| **Cloud Deployment**       | Docker, AWS                                                                      |
| **Other Tools**            | jsPDF (PDF Creation), Pyodide (Running Python Scripts in browser), chartJS (Graphs and Statisitics) |


# **CodeSprout**

We deployed our application on netlify. Link : https://6701aec6aa1f287e6966a194--codesprout-javafest.netlify.app/

