class Application {

    constructor(user, id, income, amount, term) {
        this.user = user;
        this.id = id;
        this.income = income;
        this.amount = amount;
        this.term = term;
    }

    status = 'pending';
}

class Offer {

    constructor(interest, amount, monthlyPayment, term, id) {

        this.interest = interest;
        this.amount = amount;
        this.monthlyPayment = monthlyPayment;
        this.term = term;
        this.id = id;
    }
}
class Loan {

    constructor(interest, amount, monthlyPayment, term, id) {

        this.interest = interest;
        this.amount = amount;
        this.monthlyPayment = monthlyPayment;
        this.term = term;
        this.id = id;
        this.totalLoan = Number(this.term) * Number(this.monthlyPayment);
    }

}

class LoanManager {

    // constructor get's called every time when we create a new instance 
    constructor() {


    }

    nextLoanId = 1;
    applications = [];


    acceptOffer = (interest, amount, monthlyPayment, term, id, username) => {

        let loan = new Loan (interest, amount, monthlyPayment, term, id);

        userManager.addLoan(username, loan);

    }


    submitApplication = (username, income, amount, term) => {

        this.applications.push(new Application(username, this.nextLoanId, income, amount, term));
        this.nextLoanId++;

    }

    cancelApp = (id) => {

        let foundApp = this.applications.find(app => app.id === id);

        let index = this.applications.indexOf(foundApp);

        this.applications.splice(index, 1);
    }

    requestOffers = (application) => {

        return new Promise((res, rej) => {

            setTimeout(() => {

                let banks = [[0.11, 150000], [0.09, 100000], [0.07, 50000]];
                let offers = [];

                banks.forEach(bank => {
                    let offer = this.evaluate(application, bank[0], bank[1]);

                    if (offer) {
                        offers.push(offer);
                    }
                })

                console.log('timeout offer');

                if(offers.length) {
                    application.offers = offers;
                    application.status = 'approved';
                    res (offers);
                }
                else {
                    application.status = 'rejected';
                    rej (offers);
                }
            }, 5*1000)

        })
    }

    evaluate = (application, rate, maxLoan) => {

        let interest = null;

        if (application.income < 20000) {
            interest = 0.10;
        } else if (application.income > 20000 && application.income < 50000) {
            interest = 0.08;
        } else {
            interest = 0.06;
        }

        if (
            application.amount > application.income * 12 ||
            (application.amount > application.income * 6 && application.term > 24) ||
            rate < interest
        ) {
            return;
        }

        let amount = application.amount > maxLoan ? maxLoan : application.amount;
        let monthlyPayment = amount * (1 + interest * application.term / 12) / application.term;


        return new Offer(interest * 100, amount, monthlyPayment.toFixed(2), application.term, application.id);

    }
}
let loanManager = new LoanManager(); 