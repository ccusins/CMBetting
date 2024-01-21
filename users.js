function checkUserStatus(ID, username) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/checkstatus/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        let isSuccess = data.success;
        if (isSuccess) {
            let notDoneContactContainer = document.querySelector('.set_up_item_container.notdone.contact');
            let doneContactContainer = document.querySelector('.set_up_item_container.done.contact');
            notDoneContactContainer.style.display = "none";
            doneContactContainer.style.display = "block";

            let notDoneContractContainer = document.querySelector('.set_up_item_container.notdone.contract');
            let notDoneBankContainer = document.querySelector('.set_up_item_container.notdone.bank');

            contract = data.contract;
            bank = data.bank;

            if (contract === 'done' && bank === 'done') {
                
                let disabledMenuItems = document.querySelectorAll('.menu_item_container.disabled');
                for (let i = 0; i < disabledMenuItems.length; i++) {
                    disabledMenuItems[i].style.display = 'none';
                }
                
                let enabledMenuItems = document.querySelectorAll('.menu_item_container.enabled');
                for (let i = 0; i < enabledMenuItems.length; i++) {
                    enabledMenuItems[i].style.display = 'block';
                }
            }

            if (contract === 'pending') {
                let pendingContractContainer = document.querySelector('.set_up_item_container.pending.contract');
                pendingContractContainer.style.display = "block";
                notDoneContractContainer.style.display = "none";
            } else if (contract === 'done') {
                let doneContractContainer  = document.querySelector('.set_up_item_container.done.contract');
                doneContractContainer.style.display = "block";
                notDoneContractContainer.style.display = "none";
            }

            if (bank === 'pending') {
                let pendingBankContainer = document.querySelector('.set_up_item_container.pending.bank');
                pendingBankContainer.style.display = "block";
                notDoneContractContainer = "none";
            } else if (bank === 'done') {
                let doneBankContainer = document.querySelector('.set_up_item_container.done.bank');
                doneBankContainer.style.display = "block";
                notDoneBankContainer.style.display = "none";
            }

        } else {
            const setUpForm = document.getElementById('contact-form');
            setUpForm.addEventListener('submit', function(e) {
                e.preventDefault();

                let phone = setUpForm.querySelector('#phone-set-up').value; 
                let email = setUpForm.querySelector('#email-set-up').value; 

                fetch(`https://cmbettingoffers.pythonanywhere.com/adduser/${encodeURIComponent(username)}/${encodeURIComponent(ID)}/${encodeURIComponent(phone)}/${encodeURIComponent(email)}`)
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                })
            });
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    })

}

function checkProfit(ID) {
    fetch(`https://cmbettingoffers.pythonanywhere.com/checkprofit/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        let isSuccess = data.success;
        let profitTitle = document.getElementById('profit-title');
        let depositsProfitTitle = document.querySelector('h1.deposits.money.profit_text.counter')

        if (isSuccess) {
            profitText = data.profit;
            profitTitle.textContent = `£${profitText}`;
            depositsProfitTitle.textContent = `£${profitText}`;
        } else {
            profitTitle.textContent = "£0";
            depositsProfitTitle.textContent = "£0";
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    })

}

function getBookmakers(ID, accountName) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/getbookmakers/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let isSuccess = data.success;
        if (isSuccess) {

            let bookmakerCounter = 0;

            let bookmakerHolders = document.querySelectorAll('.bookmaker_holder');
            bookmakerHolders.forEach(holder => {

                let found = false;
                let bookmaker = holder.querySelector("h1.bookmaker_title").textContent;

                if (isSuccess) {
                    found = data.bookmakers.some(item => item.bookmaker === bookmaker);
                }

                let statusHolder = holder.querySelector(".bookmaker_status_holder");
                let statusTitle = holder.querySelector(".bookmaker_status_title");
                let enterDetailsButton = holder.querySelector(".show_form");
                let bookmakerLink = holder.querySelector(".bookmaker_link");

                if (found) {

                    statusTitle.textContent = "MADE";
                    statusHolder.style.backgroundColor = "lightgreen";
                    statusTitle.style.fontFamily = "Montserrat, sans-serif";
                    statusTitle.style.fontWeight = "bold";

                    enterDetailsButton.style.display = "none";
                    bookmakerLink.style.display = "none";

                    bookmakerCounter++;
                } else {
                    statusTitle.textContent = "NOT MADE";
                    statusHolder.style.backgroundColor = "lightred";
                    statusTitle.style.fontFamily = "Montserrat, sans-serif";
                    statusTitle.style.fontWeight = "bold";

                    let addBookmakerDetailsForm = holder.querySelector('.bookmaker_form');
                    addBookmakerDetailsForm.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let username = holder.querySelector('.text_field.username').value;
                        let email = holder.querySelector('.text_field.email').value;
                        let accountSetting = holder.querySelector('.text_field.account_setting').value;

                        fetch(`https://cmbettingoffers.pythonanywhere.com/addbookmakerdetails/${encodeURIComponent(accountName)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(username)}/${encodeURIComponent(email)}/${encodeURIComponent(accountSetting)}/${encodeURIComponent(ID)}`)
                        .catch(error => {
                            console.error('Error:', error);
                        })
                    });
                }
            });

            let casinoHolders = document.querySelectorAll('.casino_holder')
            casinoHolders.forEach(casinoHolder => {

                let casinoTitle = casinoHolder.querySelector('h1.casino_title').textContent;
                let casinoStatusText = casinoHolder.querySelector('h1.casino_status_text');
                let casinoLinkButton = casinoHolder.querySelector('.casino_link');
                let casinoEnterDetailsButton = casinoHolder.querySelector('.casino_show_form');                
                
                let casinoFound = false;

                if (isSuccess) {
                    casinoFound = data.bookmakers.some(item => item.bookmaker === casinoTitle);
                }
                
                if (casinoFound) {

                    bookmakerCounter++;

                    casinoStatusText.textContent = "MADE";
                    casinoStatusText.style.backgroundColor = "lightgreen";
                    casinoStatusText.style.fontFamily = "Montserrat, sans-serif";
                    casinoStatusText.style.fontWeight = "bold";

                    casinoEnterDetailsButton.style.display = "none";
                    casinoLinkButton.style.display = "none";

                } else {
                    casinoStatusText.textContent = "NOT MADE";
                    casinoStatusText.style.backgroundColor = "lightred";
                    casinoStatusText.style.fontFamily = "Montserrat, sans-serif";
                    casinoStatusText.style.fontWeight = "bold";

                    let casinoEnterDetailsForm = casinoHolder.querySelector('#casino-form')

                    casinoEnterDetailsForm.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let casinoUsername = casinoEnterDetailsForm.querySelector('#casino-username').value;
                        let casinoEmail = casinoEnterDetailsForm.querySelector('#casino-email-address').value;
                        let casinoAccountSetting = casinoEnterDetailsForm.querySelector('#casino-account-setting').value;

                        fetch(`https://cmbettingoffers.pythonanywhere.com/addbookmakerdetails/${encodeURIComponent(accountName)}/${encodeURIComponent(casinoTitle)}/${encodeURIComponent(casinoUsername)}/${encodeURIComponent(casinoEmail)}/${encodeURIComponent(casinoAccountSetting)}/${encodeURIComponent(ID)}`)
                        .catch(error => {
                            console.error('Error:', error);
                        });

                    });
                    
                }


            });

            let bookmakerCounterText = document.querySelector('h1.stat_title.accounts');
            bookmakerCounterText.textContent = bookmakerCounter.toString();

        }


    })
    .catch(error => {
        console.error('Error:', error);
    })

}

function getDeposits(ID) {

    let totalText = document.querySelector('h1.deposits.money.our_text.counter')
    let amountOwedText = document.querySelector('h1.deposits.money.owed_text.counter')
    let profitText = document.querySelector('h1.deposits.money.profit_text.counter')

    fetch(`https://cmbettingoffers.pythonanywhere.com/checkmoney/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(data => {
        let isSuccess = data.success;
        if (isSuccess) {
            total = parseFloat(data.total);
            let profit = profitText.textContent;
            let numericProfit = parseFloat(profit.substring(1));

            amountOwed = total - numericProfit;

            totalText.textContent = `£${total}`;
            amountOwedText.textContent = `£${amountOwed}`;

        } else {
            totalText.textContent = "£0";
            amountOwedText = "£0";
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    })

    fetch(`https://cmbettingoffers.pythonanywhere.com/getdeposits/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        let isSuccess = data.success 
        
        if (isSuccess) {
            for (let i = 0; i < data.data.length; i++) {

                let deposit = data.data[i];
                const uncompleteDepositTemplate = document.getElementById('uncomplete-deposit-template');
                const pendingDepositTemplate = document.getElementById('pending-deposit-template');
                const container = document.getElementById('deposits-container');

                let depositStatus = deposit.status;

                if (depositStatus === 'uncompleted') {
                    let newDeposit = uncompleteDepositTemplate.cloneNode(true);

                    newDeposit.style.display = 'block'; 
                    newDeposit.querySelector('.deposits_bookmaker_title').innerText = deposit.bookmaker;
                    newDeposit.querySelector('.deposits_amount_title').innerText = deposit.amount;
                    container.appendChild(newDeposit);

                    let completeDeposit = newDeposit.querySelector('.complete_button');
                    completeDeposit.addEventListener('click', function() {
                        fetch(`https://cmbettingoffers.pythonanywhere.com/pendingdeposit/${encodeURIComponent(ID)}/${encodeURIComponent(deposit.bookmaker)}`)
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });

                        container.removeChild(newDeposit)
                    });

                } else if (depositStatus === 'pending') {
                    let newDeposit = pendingDepositTemplate.cloneNode(true);
                    newDeposit.style.display = 'block'; 
                    newDeposit.querySelector('.deposits_bookmaker_title').innerText = deposit.bookmaker;
                    newDeposit.querySelector('.deposits_amount_title').innerText = deposit.amount;
                    container.appendChild(newDeposit);
                }

            };
        }

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function setUpSwitchListener() {

    let casinoSwitchButton = document.querySelector('.accounts.switch.casino')
    let bookmakerSwitchButton = document.querySelector('.accounts.switch.bookmaker')

    let casinoRowsHolder = document.querySelector('.casino_rows')
    let bookmakerRowsHolder = document.querySelector('.bookmaker_rows')

    casinoSwitchButton.addEventListener('click', function() {
        
        casinoRowsHolder.style.display = "flex";
        casinoRowsHolder.style.flexDirection = "column";
        bookmakerRowsHolder.style.display = "none";
        
        casinoSwitchButton.style.backgroundColor = "#74d2e8";
        casinoSwitchButton.style.color = "#444343";

        bookmakerSwitchButton.style.backgroundColor = "#303030";
        bookmakerSwitchButton.style.color = "white";

    });

    bookmakerSwitchButton.addEventListener('click', function() {
        
        bookmakerRowsHolder.style.display = "flex";
        bookmakerRowsHolder.style.flexDirection = "column";
        casinoRowsHolder.style.display = "none";

        bookmakerSwitchButton.style.backgroundColor = "#74d2e8";
        bookmakerSwitchButton.style.color = "#444343";

        casinoSwitchButton.style.backgroundColor = "#303030";
        casinoSwitchButton.style.color = "white";


    });
}   



document.addEventListener('DOMContentLoaded', function() {

    let currentUrl = window.location.href;
    let parts = currentUrl.split('/');
    let ID = parts[parts.length - 1];
    let username = document.querySelector('h1.account_username').textContent;

    checkUserStatus(ID, username);
    setUpSwitchListener();
    checkProfit(ID);
    getBookmakers(ID, username);
    getDeposits(ID);

});