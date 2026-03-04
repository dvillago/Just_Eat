# App name: Just Eat 
 
Science-based nutrition guiding app that automatically plans your meals and uses DoorDash API to order your food automatically; a cheaper alternative to HelloFresh or similar 
 
This is not an “AI powered” meal planning app. The hard-coded algorithm should be understandable and transparent instead of a black box, since it directly deals with health. (This also means the users will be able to tweak the algorithm as they like, say, to make a diet only consisting of candies and energy drinks for fun, but we will not discuss about this possibility in this brainstorming memo) 
 
This is not a simple delivery ordering app, the user shall go to the actual Kroger or Walmart apps to get a normal food delivery experience. The user cannot easily add or remove an item to/from the cart arbitrarily, unless removing some preexisting item within the macronutrients quota to add another that effectively replaces the nutritional value of the removed item. You eat whatever the optimal algorithm tells you, and you won’t buy potato chips if that is how you set your algorithm. 

## Brainstorming
 
**Default settings for the algorithm**:   
·  Can order fresh ingredients only 
·  Has a quota for each macronutrients 
·  Quota is calculated taking consideration of your underlying conditions and characteristics 
    o  Input your last health checkup data for more precision 
        §  It might not be a good idea to host the app on the cloud if it includes such sensitive information and if it’s an app that you rely upon in your day to day life. Refer to the latest AWS outage: https://technical.ly/entrepreneurship/aws-us-east-1-outage-explainer/   

·  Both offers a mobile app and a CLI experience (including mobile CLI such as Termux, which means a TUI for the mobile form factor should be considered alongside a TUI design for the desktop form factor), where both are synched together. 
    o  The CLI version will be useful when debugging and when developing the backend before the mobile app frontend has been implemented or designed. 
    o  The CLI version improves developer friendliness 

·  Asks the user what allergies they have or what diet they follow, and modify the nutrition plan for fixed, recurring periods like Ramadan 

·  Information section about the basics of nutrition 
    o  Links to sites like PubMed, WebMD, FamilyDoctor, or more websites that the user chooses to include 
        §  In-app PubMed and Google Scholar search 
        §  AI chatbot similar to Perplexity AI that helps you aggregate and analyze new research in case you have a rarely documented medical condition and standard medical advice needs to be adjusted through your own discretion and self-education.   
    o  Casual health advice 

·  User can alternatively use Kroger API (https://developer.kroger.com/)  
