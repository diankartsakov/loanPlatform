class User {
    constructor(user, pass) {
        this.username = user;
        this.pass = pass;
    }
    
    loans = [];

}

class UserManager {

    // constructor get's called every time when we create a new instance 
    constructor() {
        let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
        if (loggedUser) {
            this.loggedUser = loggedUser;
        }
        let users = JSON.parse(localStorage.getItem('allUsers'));
        if (users) {
            this.users = users;
        }
    }
    loggedUser = null;

    users = [new User('dido', 'dido'), new User('pandi', 'pandi')];


    addLoan = (username, loan) => {

        let foundUser = this.users.find(user => user.username === username);

        foundUser.loans.push(loan);
        this.loggedUser = foundUser;
        localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
        localStorage.setItem('allUsers', JSON.stringify(this.users));

    }    


    login = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username &&
            user.pass === pass
        );
        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
            return true;
        }

        return false;
    }

    logout = () => {
        this.loggedUser = null;
        localStorage.removeItem('isThereUser');
    }

    register = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username);

        if (!foundUser) {
            this.users.push(new User(username, pass));
            localStorage.setItem('allUsers', JSON.stringify(this.users));

            return true;
        }
        return false;
    }

    existingUsername = (username) => {
        let foundUser = this.users.find(user => user.username === username);
        if (foundUser) {
            return true;
        }
        return false;
    }


}
let userManager = new UserManager(); 