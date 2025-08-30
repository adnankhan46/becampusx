 import { useState, useRef, useEffect } from 'react';
 import { parseMarkdownToHtml } from '../utils/parseMarkdownToHtml'; // Import the function
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faWandSparkles } from '@fortawesome/free-solid-svg-icons';
 import { GoogleGenerativeAI } from "@google/generative-ai"; 

 function Chatbox() {
  const [question, setQuestion] = useState("");
   const [answer, setAnswer] = useState(""); // Full answer
   const [typedAnswer, setTypedAnswer] = useState(""); // Incrementally typed answer
   const [history, setHistory] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const chatBoxRef = useRef(null);
   

   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

   const model = genAI.getGenerativeModel({
     model: import.meta.env.VITE_GEMINI_MODEL,
   });
 
    const generationConfig = {
     temperature: 1,
     topP: 0.95,
     topK: 64,
     maxOutputTokens: 8192,
     responseMimeType: "text/plain",
   };
 
   async function generateAnswer() {
     if (!question.trim()) {
       setError("Please enter a valid question.");
       return;
     }
     setError("");
     setIsLoading(true);
 
     try {
       const parts = [
         { text: "input: your name ?" },
         { text: "output: I am CampusAI" },
         { text: "input: who are you ?" },
         { text: "output: An AI assistance named \"CampusAI by BeCampusX\" providing information about \"BIT Durg\" College, trained and maintained by CampusX builders" },
         { text: "input: founders of Campus ai and becampus x ?" },
         { text: "output: Adnan Khan and Garv Thakre" },
         { text: "input: what is BeCampusx?" },
         { text: "output: BeCampusX or BeCampusX-BITD is an Anonymous Social Networking Site specially for students. CampusX also provides Economic Opportunites for students." },
         { text: "input: Tell more about economic opportunities in Campusx?" },
         { text: "output: It is incentivized Opportunity finding Social App. A social app in the campus that connects students with companies offering paid micro-tasks, such as: 1. Engagement tasks:Commenting on posts, liking content, subscribing to channels. 2. Survey task: Filling out surveys, giving feedback on products or services. 3. Marketing task: Serving as campus ambassadors or brand representatives. 3. Work Experience tasks: Short internships, project-based gigs. 4. Professors Survey, etc" },
         { text: `input: ${question}` }, // Including the user's question dynamically
       ];
 
       const result = await model.generateContent({
         contents: [{ role: "user", parts }],
         generationConfig,
       });
 
       if (result.response && result.response.text) {
         const generatedAnswer = result.response.text();
         setAnswer(generatedAnswer);
         setHistory((prevHistory) => [...prevHistory, { question, answer: generatedAnswer }]);
       } else {
         setAnswer("Unexpected response structure.");
         setError("Failed to generate an answer.");
       }
 
     } catch (error) {
       console.error("Error generating answer:", error);
 
       if (error.response) {
         setError(`Error: ${error.response.status} - ${error.response.data.message || 'Server error'}`);
       } else if (error.request) {
         setError("Network error. Please check your internet connection.");
       } else {
         setError("An unexpected error occurred. Please try again.");
       }
 
       setAnswer("Failed to generate an answer.");
     } finally {
       setIsLoading(false);
       setQuestion("");
     }
   }

  useEffect(() => {
    // Typewriter effect
    const typingSpeed = 8;
    let index = 0;
    if (answer) {
      const typingInterval = setInterval(() => {
        setTypedAnswer(answer.slice(0, index + 1)); // Add one character at a time
        index++;
        if (index === answer.length) {
          clearInterval(typingInterval); // Stop typing when done
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval); // Clean up on unmount
    }
  }, [answer]);

  useEffect(() => {
    // Scroll to the bottom after answer is typed
    if (typedAnswer) {
      chatBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [typedAnswer]);

  return (
    <div className="flex flex-col h-full rounded-lg overflow-y-auto scroll-smooth font-inter">
      <div className="flex-grow">
        {/* Chat history */}
        <div className="overflow-y-auto scroll-smooth">
          {history.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2 pb-2 mb-2">
              <div className="bg-blue-100 text-blue-800 p-2 mr-2 text-base rounded-lg border self-end w-fit max-w-3/4 border-blue-200">
                <p>{item.question}</p>
                 
              </div>
              
              <div className="bg-white text-gray-800 p-2 ml-2 mr-2 rounded-lg border text-base self-start border-gray-200">
                <p>
                  <FontAwesomeIcon icon={faWandSparkles} className='md:h-6 h-4 mx-2 text-[#6a7cff]' />
                  <span dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(index === history.length - 1 ? typedAnswer : item.answer) }} />
                </p>
              </div>
            </div>
          ))}
<div ref={chatBoxRef} />
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin text-blue-500 h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full"></div>
        </div>
      )}
      {/* Fixed button and input section */}
      <div className="fixed bottom-20 w-full bg-white p-2 border-t border-gray-200">
        {error && <p className="text-red-500 bg-red-100 p-2 rounded-lg">{error}</p>}
        <input
          placeholder="Ask a question..."
          className="border rounded-full p-3 w-full text-gray-700 mb-2 outline-none"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <button
          className={`p-2 rounded-lg w-full ${isLoading ? 'bg-[#c9cfff]' : 'bg-[#6a7cff]'} text-white`}
          onClick={generateAnswer}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center"> Generating...
            <div className="animate-spin text-[#6a7cff] h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full">
            </div>
            </div>
          ) : "Generate Answer"}
        
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
