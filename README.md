_________________________________________________________________________________________________________________________________________

#RO
_________________________________________________________________________________________________________________________________________

Anti Food Waste App este o aplicație web care ajută utilizatorii să gestioneze alimentele din frigider și să reducă risipa alimentară. 
Aplicația are ca scop crearea unui spațiu unde utilizatorii își pot oferi prietenilor sau grupurilor produsele pe care nu le mai consumă. 
Astfel totul se realizează într-un mod simplu, comunitar și organizat.
_________________________________________________________________________________________________________________________________________

Functionalități principale:
    • Gestionarea alimentelor;
    • Alerte privind expirarea produselor;
    • Partajarea alimentelor disponibile;
    • Permiterea altor utilizatori de a face “claim”;
    • Gestionarea și creare unor grupuri bazate pe preferințele alimentare;
    • Utilizatorul își poate invita prietenii pentru a-i vizualiza lista de produse;
    • Integrare social media;

_________________________________________________________________________________________________________________________________________

Proiect educațional realizat în cadrul materiei Tehnologii Web
București 2025
Academia de Studii Economice din București
Facultatea de Cibernetică, Statistică și Informatică Economică 
Echipa de dezvoltare Kit&Miautette, formată din:
    • Condurache-Bota Dora-Elena
    • Georgescu Ionuț-Bogdan

_________________________________________________________________________________________________________________________________________

Arhitectura proiectului și tehnologii utilizate:
Proiectul este împărțit în două mari componente: frontend și backend.
    • Frontend:
        o React;
        o React Router;
        o Tailwind CSS / Bootstrap / CSS Modules;
    • Backend:
        o Node.js;
        o Express.js;
        o JSON Web Token;
        o ORM – Sequelize;
    • Baza de date:
        o Bază de date relațională de tip SQL – PostgreSQL;
    • Deploy:
        o Azure;

_________________________________________________________________________________________________________________________________________


Instrucțiuni de rulare:
Înainte de a rula backend-ul sunt necesare:
• Node.js;
• PostgreSQL;
• O bază de date creată numită foodShare;
• Un user PostgreSQL pentru a accesa baza de date (ex. user: postgres, parolă: parola_ta);
• Git pentru clonare;

1. Clonează repository-ul: git clone https://github.com/doracb/Anti-Food-Waste-App.git

2. Instalează dependențele: npm install

3. Deschide fișierul src/sequelize și setează valorile tale PostgreSQL pentru numele bazei de date, username-ul și parola aleasă.

4. Pornește serverul cu "node src/app.js"
    Opțional: dacă ai nodemon instalat, rulează "nodemon src/app.js"
    Sau adaugă în package.json:
        "scripts" {
            "start": "node src/app.js",
            "dev": "nodemon src/app.js"
        }
    Apoi rulează "npm start" sau "npm run dev"

5. Accesează API-ul:
    Serverul va porni implicit pe "http://localhost:3000/api". Ar trebui să primești: { message: "FoodShare API is running..."}

6. Testare API cu Postman sau Thunder Client
    Poți testa endpoint-urile disponibile:
        • Users;
        • Foods;
        • Groups;
        • Claims;

_________________________________________________________________________________________________________________________________________

#EN
_________________________________________________________________________________________________________________________________________

Anti Food Waste App is a web application designed to help users manage the food in their fridge and reduce food waste. 
The application aims to create a space where users can share products they no longer consume with their friends or groups. 
Everything is done in a simple, community-based and organized way.
Main functionalities:
•	Food management;
•	Expiration alerts;
•	Sharing available foods;
•	Allowing other users to make a “claim”;
•	Managing and creating groups based on food preferences;
•	Users can invite their friends to view their product list;
•	Social media integration;

_________________________________________________________________________________________________________________________________________

Educational project carried out within the subject of Web Technologies
Bucharest 2025
Bucharest University of Economic Studies
Faculty of Cybernetics, Statistics and Economic Informatics
Development team:
    • Condurache-Bota Dora-Elena
    • Georgescu Ionuț-Bogdan

_________________________________________________________________________________________________________________________________________

Project architecture and used technologies:
The project is divided into two major components: frontend and backend.
    • Frontend:
        o React;
        o React Router;
        o Tailwind CSS / Bootstrap / CSS Modules;
    • Backend:
        o Node.js;
        o Express.js;
        o JSON Web Token;
        o ORM – Sequelize;
    • Database:
        o SQL relational database – PostgreSQL;
    • Deploy:
        o Azure;

_________________________________________________________________________________________________________________________________________


Running instructions:
Before running the backend you need:
• Node.js;
• PostgreSQL;
• A created database called foodShare;
• A PostgreSQL user to access the database (e.g. user: postgres, password: your_password);
• Git for cloning;

1. Clone the repository: git clone https://github.com/doracb/Anti-Food-Waste-App.git

2. Install dependencies: npm install

3. Open the src/sequelize file and set your PostgreSQL values ​​for the database name, username, and chosen password.

4. Start the server with "node src/app.js"
    Optional: if you have nodemon installed, run "nodemon src/app.js"
    Or add to package.json:
        "scripts" {
        "start": "node src/app.js",
        "dev": "nodemon src/app.js"
    }
    Then run "npm start" or "npm run dev"

5. Access the API:
    The server will start by default on "http://localhost:3000/api". You should get: { message: "FoodShare API is running..."}

6. Test the API with Postman or Thunder Client:
    You can test the available endpoints:
        • Users;
        • Foods;
        • Groups;
        • Claims;

_________________________________________________________________________________________________________________________________________