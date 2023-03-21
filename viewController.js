class ViewController {

    constructor() {
        window.addEventListener('hashchange', this.handleHashChange),
            window.addEventListener('load', this.handleHashChange)
    }

    handleHashChange = () => {

        let hash = window.location.hash.slice(1) || 'home';

        const pageIds = ['login', 'register', 'home', 'overview', 'loans'];

        // add all page view in pageIds array 

        if (hash === 'home' || hash === 'overview' || hash === 'loans') {
            if (!userManager.loggedUser) {
                location.hash = 'login';
                return;
            }
            if (hash === 'overview' && loanManager.applications.length === 0) {
                location.hash = "home";
                return;
            }
        }

        let logoutBtn = document.getElementById('logout');
        let registerNav = document.getElementById('registerNav');
        let loginNav = document.getElementById('loginNav');
        // let homeNav = document.getElementById('homeNav');
        // let overviewNav = document.getElementById('overviewNav');
        // let loansNav = document.getElementById('loansNav');

        if (userManager.loggedUser) {
            logoutBtn.style.display = 'flex';
            registerNav.style.display = 'none';
            loginNav.style.display = 'none';
            // homeNav.style.display = 'flex';
            // overviewNav.style.display = 'flex';
            // loansNav.style.display = 'flex';
        }

        if (hash === "logout" && userManager.loggedUser) {

            logoutBtn.style.display = 'none';
            registerNav.style.display = 'flex';
            loginNav.style.display = 'flex';
            // homeNav.style.display = 'none';
            // overviewNav.style.display = 'none';
            // loansNav.style.display = 'none';

            userManager.logout();
            location.hash = 'login';

        }

        pageIds.forEach(id => {

            let element = document.getElementById(id);

            if (hash === id) {

                element.style.display = 'flex';
            }

            else {
                element.style.display = 'none';
            }
        })

        switch (hash) {

            case 'login':
                this.renderLogin();
                break;
            case 'register':
                this.renderRegister();
                break;
            case 'home':
                this.renderHomePage();
                break;
            case 'overview':
                this.renderOverviewPage();
                break;
            case 'loans':
                this.renderLoansPage();
                break;
        }
    }

    renderLogin = () => {

        let form = document.getElementById('loginForm');
        let error = document.getElementById('loginError');
        error.style.display = 'none';

        form.addEventListener('change', (e) => {

            let username = e.target.parentElement.elements.username.value;
            let pass = e.target.parentElement.elements.password.value;
            let loginBtn = document.getElementById('loginBtn');

            if (username.trim().length !== 0 && pass.length !== 0) {
                loginBtn.disabled = false;
            }
            else {
                loginBtn.disabled = true;
            }

        })



        form.onsubmit = (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.password.value;

            let successfulLogin = userManager.login({ username, pass });

            if (successfulLogin) {

                document.getElementById('logout').style.display = 'flex';

                location.hash = 'home';
                error.style.display = 'none';
            }
            else {
                error.style.display = 'block';
            }
            e.target.reset();
        };
    }

    renderRegister = () => {

        let form = document.getElementById('registerForm');

        form.removeEventListener('change', this.regFormChange);
        form.addEventListener('change', this.regFormChange);


        form.onsubmit = (e) => {

            e.preventDefault();

            let username = e.target.elements.username.value;
            let pass = e.target.elements.password.value;

            userManager.register({ username, pass });

            e.target.reset();

            e.target.elements.submitReg.disabled = true;
        };

        let showPass = document.getElementById('showHidePass');

        showPass.removeEventListener('click', this.showHidePassEvent);
        showPass.addEventListener('click', this.showHidePassEvent);
    }

    regFormChange = (e) => {

        e.preventDefault();

        let usernameError = document.getElementById('usernameError');
        usernameError.style.display = 'none';
        let passError = document.getElementById('passError');
        passError.style.display = 'none';
        let confirmPassError = document.getElementById('confirmPassError');
        confirmPassError.style.display = 'none';

        let username = e.target.parentElement.elements.username.value;
        let pass = e.target.parentElement.elements.password.value;
        let confirmPass = e.target.parentElement.elements.confirmPassword.value;

        let existingUsername = userManager.existingUsername(username);

        if (existingUsername) {
            usernameError.style.display = 'block';
            usernameError.innerText = `${username} is already registered`;
        }
        let validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

        if (!validPass.test(pass) && pass.length !== 0) {

            passError.style.display = 'block';
        }
        if (pass !== confirmPass && confirmPass.length !== 0) {
            confirmPassError.style.display = 'block';
        }

        let submitRegBtn = document.getElementById('submitReg');

        if (usernameError.style.display === 'none' &&
            passError.style.display === 'none' &&
            confirmPassError.style.display === 'none' &&
            username.length !== 0 &&
            pass.length !== 0 &&
            confirmPass.length !== 0
        ) {
            submitRegBtn.disabled = false;
        }
        else {
            submitRegBtn.disabled = true;
        }
    }

    showHidePassEvent = (e) => {

        let passFields = document.querySelectorAll('.passField');

        if (e.target.value !== 'Hide password') {

            for (let i = 0; i < passFields.length; i++) {
                passFields[i].type = 'text';
            }
            e.target.value = 'Hide password';
        }
        else {
            for (let i = 0; i < passFields.length; i++) {
                passFields[i].type = 'password';
            }
            e.target.value = 'Show password';
        }
    }

    renderHomePage = () => {

        let form = document.getElementById('loanApplicationForm');
        form.borrowerName.value = userManager.loggedUser.username;

        form.removeEventListener('change', this.loanFormChange);
        form.addEventListener('change', this.loanFormChange);

        form.onsubmit = (e) => {

            e.preventDefault();

            let borrowerName = e.target.elements.borrowerName.value;
            let borrowerIncome = e.target.elements.borrowerIncome.value;
            let requestedAmount = e.target.elements.requestedAmount.value;
            let requestedTerm = e.target.elements.requestedTerm.value;

            loanManager.submitApplication(borrowerName, borrowerIncome, requestedAmount, requestedTerm);

            e.target.reset();
            e.target.elements.submitLoanApplication.disabled = true;

            location.hash = 'overview';
        };
    }

    loanFormChange = (e) => {

        e.preventDefault();

        let incomeErr = document.getElementById('incomeErr');
        incomeErr.style.display = 'none';

        let loanSizeErr = document.getElementById('loanSizeErr');
        loanSizeErr.style.display = 'none';

        let durationErr = document.getElementById('durationErr');
        durationErr.style.display = 'none';

        let borrowerIncome = e.target.parentElement.elements.borrowerIncome.value;
        let requestedAmount = e.target.parentElement.elements.requestedAmount.value;
        let requestedTerm = e.target.parentElement.elements.requestedTerm.value;


        if (borrowerIncome < 100 && borrowerIncome.length !== 0) {
            incomeErr.style.display = 'block';
        }

        if (requestedAmount < 1000 && requestedAmount.length !== 0) {
            loanSizeErr.style.display = 'block';
        }

        if ((requestedTerm < 6 || requestedTerm > 120) && requestedTerm.length !== 0) {
            durationErr.style.display = 'block';
        }

        let submitBtn = document.getElementById('submitLoanApplication');

        if (incomeErr.style.display === 'none' &&
            loanSizeErr.style.display === 'none' &&
            durationErr.style.display === 'none' &&
            borrowerIncome.length !== 0 &&
            requestedAmount.length !== 0 &&
            requestedTerm.length !== 0
        ) {
            submitBtn.disabled = false;
        }
        else {
            submitBtn.disabled = true;
        }

    }

    cancelApplication = (event) => {
        loanManager.cancelApp(event.target.parentElement.id.innerText);
        location.hash = 'home';
    }

    renderOverviewPage = () => {

        let tableBody = document.getElementById('overviewTableBody');
        tableBody.innerHTML = "";

        let offersContainer = document.getElementById('offersContainer');
        offersContainer.innerHTML = "";

        loanManager.applications.forEach(app => {

            let tr = document.createElement('tr');

            let id = document.createElement('td');
            id.name = 'id';
            id.innerText = app.id;
            let amount = document.createElement('td');
            amount.name = 'amount';
            amount.innerText = `${app.amount} BGN`;
            let term = document.createElement('td');
            term.name = 'term';
            term.innerText = `${app.term} months`;
            let status = document.createElement('td');
            status.name = 'status';
            status.innerText = app.status;
            let action = document.createElement('td');
            action.name = 'action';

            let cancelBtn = document.createElement('input');
            cancelBtn.type = 'button';
            cancelBtn.value = "Cancel";
            action.appendChild(cancelBtn);

            cancelBtn.removeEventListener('click', this.cancelApplication);
            cancelBtn.addEventListener('click', this.cancelApplication);

            let offer = document.createElement('td');
            offer.name = 'offer';

            let offerBtn = document.createElement('input');
            offerBtn.type = 'button';
            offerBtn.value = "Offers";

            if (app.status !== 'approved') {
                offerBtn.style.display = 'none';
            }

            offer.appendChild(offerBtn);

            tr.append(id, amount, term, status, action, offer);

            if (app.offers) {
                offerBtn.addEventListener('click', () => { this.renderOffers(app.offers) });
            }
            else if (app.status === 'pending') {

                let offers = loanManager.requestOffers(app)
                    .then(result => {
                        status.innerText = 'approved';
                        offerBtn.style.display = 'block';

                        offerBtn.addEventListener('click', () => { this.renderOffers(result) });

                        console.log(result);
                        return result;
                    })
                    .catch(result => {
                        status.innerText = 'rejected';

                        return result;
                    })

                console.log(offers);

            }

            tableBody.appendChild(tr);

        })
    }

    renderOffers = (offersArr) => {

        let offersContainer = document.getElementById('offersContainer');

        offersContainer.innerHTML = "";

        offersArr.forEach(offer => {

            if (typeof offer !== "undefined") {

                let offerDiv = document.createElement('div');
                offerDiv.className = 'offerDiv';

                let header = document.createElement('h3');
                header.innerText = 'Offer';

                let interest = document.createElement('div');
                interest.innerText = `Interest: ${offer.interest}%`;
                let amount = document.createElement('div');
                amount.innerText = `Amount: ${offer.amount}`;
                let monthlyPayment = document.createElement('div');
                monthlyPayment.innerText = `Monthly bill: ${offer.monthlyPayment}`;
                let term = document.createElement('div');
                term.innerText = `Term: ${offer.term} months`;

                let buttonDiv = document.createElement('div');
                buttonDiv.className = 'button';
                let acceptBtn = document.createElement('input');
                acceptBtn.className = `acceptBtn`;
                acceptBtn.type = `button`;
                acceptBtn.value = `Accept Offer`;

                buttonDiv.appendChild(acceptBtn);


                acceptBtn.addEventListener('click', (e) => {
                    loanManager
                        .acceptOffer(offer.interest, offer.amount, offer.monthlyPayment, offer.term, offer.id,
                            userManager.loggedUser.username)

                    loanManager.cancelApp(offer.id);

                    location.hash = 'loans';
                })

                offerDiv.append(
                    header,
                    interest,
                    amount,
                    monthlyPayment,
                    term,
                    buttonDiv
                );

                offersContainer.appendChild(offerDiv);
            }

        })
    }


    renderLoansPage = () => {


        let container = document.getElementById('loansContainer');

        container.innerHTML = "";

        userManager.loggedUser.loans.forEach(loan => {


            let loanDiv = document.createElement('div');
            loanDiv.className = 'loanDiv';

            let header = document.createElement('h3');
            header.innerText = 'Loan';

            let interest = document.createElement('div');
            interest.innerText = `Interest: ${loan.interest}%`;
            let amount = document.createElement('div');
            amount.innerText = `Amount: ${loan.amount}`;
            let monthlyPayment = document.createElement('div');
            monthlyPayment.innerText = `Monthly bill: ${loan.monthlyPayment}`;
            let term = document.createElement('div');
            term.innerText = `Term: ${loan.term} months`;
            let totalLoan = document.createElement('div');
            totalLoan.innerText = `Remaining: ${loan.totalLoan} BGN`;

            let buttonDiv = document.createElement('div');
            buttonDiv.className = 'button';
            let payBtn = document.createElement('input');
            payBtn.className = `payBtn`;
            payBtn.type = `button`;
            payBtn.value = `Pay in Full`;

            buttonDiv.appendChild(payBtn);


            //payBtn.addEventListener('click', (e) => {          })

            loanDiv.append(
                header,
                interest,
                amount,
                monthlyPayment,
                term,
                totalLoan,
                buttonDiv
            );

            container.appendChild(loanDiv);



        })



    }






}

let viewController = new ViewController();