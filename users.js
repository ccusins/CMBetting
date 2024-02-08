function setFundRequestListner(ID, stageHolder, amount) {
    
    let fundRequestButton = stageHolder.querySelector('.nb_button');
    
    fundRequestButton.addEventListener('click', function() {
        fetch(`https://cmbettingoffers.pythonanywhere.com/newfundrequest/${encodeURIComponent(ID)}/${encodeURIComponent(amount)}`)
        .then(response => { return response.json() })
        .then(data => {
            let isSuccess = data.success;

            if (isSuccess) {
                loadFundRequests(ID, stageHolder);
            }
        })
        .catch(error => {
            console.error('Problem with adding skip bookmaker details fetch', error);
        });
    });
}

function loadFundRequests(ID, stageHolder, amount) {

    let nbContainer = stageHolder.querySelector('.nb_container');
    let texts = nbContainer.querySelectorAll('.text')
    let fundsRequestButton = stageHolder.querySelector('.nb_button');

    fetch(`https://cmbettingoffers.pythonanywhere.com/getunfinishedfundrequests/${encodeURIComponent(ID)}`)
    .then(response => { return response.json() })
    .then(data => {
        let isSuccess = data.success;

        if (isSuccess) {
    
            texts[0].style.display = 'none';
            texts[1].textContent = 'Funds were requested successfully - please wait for them to be provided to continue.';
            texts[1].style.fontWeight = "bold";
            fundsRequestButton.style.display = 'none';
            nbContainer.style.backgroundColor = '#FF954F';
            
        } else {
            setFundRequestListner(ID, stageHolder, amount);
        }
    })
    .catch(error => {
        console.error('Problem with getting unfinished fund requests', error);
    });
}

function setSkipListner(ID, accountName, bookmakerHolder) {
    let skipButton = bookmakerHolder.querySelector('#skip-bookmaker-button');
    skipButton.addEventListener('click', function() {
        let bookmaker = bookmakerHolder.querySelector('.bookmaker_title').textContent;
        fetch(`https://cmbettingoffers.pythonanywhere.com/addbookmakerdetails/${encodeURIComponent(accountName)}/${encodeURIComponent(bookmaker)}/NA/NA/NA/${encodeURIComponent(ID)}`)    
        .then( response => { return response.json() })
        .then(data => { 
            setBookmakerToDone(bookmakerHolder);
        })
        .catch(error => {
            console.error('Problem with adding skip bookmaker details fetch', error);
        });
    });
}

function checkFundsForStage(netBalance, stageHolder, ID) {
    
    let bookmakerHolders = stageHolder.querySelectorAll('.bookmaker_holder');
    let runningDeposit = 0;
    let fundsNeededContainer = stageHolder.querySelector('.nb_container');
    let successContainer = stageHolder.querySelector('#stage1-funds-success')

    bookmakerHolders.forEach(bookmakerHolder => {

        let depositAmountTextHolder = bookmakerHolder.querySelector('.bookmaker_title.deposit');

        const computedStyle = window.getComputedStyle(depositAmountTextHolder);
        const isVisible = computedStyle.display !== 'none';

        if (isVisible) {

            let depositAmountText = depositAmountTextHolder.textContent;
            
            let depositMatch = depositAmountText.match(/\d+/);

            let depositAmount = depositMatch ? parseInt(depositMatch[0], 10) : 0;
            runningDeposit += depositAmount;
        }

    });
    
    if (runningDeposit < netBalance) {
        
        fundsNeededContainer.style.display = 'block';

    } else {
        if (successContainer) {
            successContainer.style.display = 'none';
        }

        let amountNeeded = runningDeposit - netBalance;
        let amountNeededText = stageHolder.querySelector('#acc-fundsneeded');
        amountNeededText.textContent = ` £${amountNeeded}`;

        bookmakerHolders.forEach(bookmakerHolder => {
            let isDone = bookmakerHolder.classList.contains("done");
            if (!isDone) {

                let disabledText = bookmakerHolder.querySelector('.disabled_ag_text');
                disabledText.style.display = 'block';

                bookmakerHolder.style.backgroundColor = '#ed746e';
                let statusText = bookmakerHolder.querySelector('.bookmaker_status_holder');
                statusText.style.display = 'none';

                let linkButton = bookmakerHolder.querySelector('.bookmaker_link');
                linkButton.style.display = 'none';

                let detailsButton = bookmakerHolder.querySelector('.show_form');
                detailsButton.style.display = 'none';

                let bookmakerTitle = bookmakerHolder.querySelector('.bookmaker_title');
                bookmakerTitle.style.color = '#1d1c1c';

                let depositTitle = bookmakerHolder.querySelector('.bookmaker_title.deposit');
                depositTitle.style.color = '#1d1c1c';

                let alreadyGotButton = bookmakerHolder.querySelector('#skip-bookmaker-button');
                alreadyGotButton.style.border = "1px solid black";
                alreadyGotButton.style.color = '#1d1c1c';


            }
        });
        

        loadFundRequests(ID, stageHolder, amountNeeded);

    }
}

function setBookmakerListener(ID, accountName, bookmakerHolder) {

    let bookmaker = bookmakerHolder.querySelector('.bookmaker_title').textContent;
    
    let addDetailsForm = bookmakerHolder.querySelector('.bookmaker_form');
    addDetailsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let username = addDetailsForm.querySelector('.text_field.username').value;
        let accountSetting = addDetailsForm.querySelector('.text_field.account_setting').value;
        let email = addDetailsForm.querySelector('.text_field.email').value;

        fetch(`https://cmbettingoffers.pythonanywhere.com/addbookmakerdetails/${encodeURIComponent(accountName)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(username)}/${encodeURIComponent(email)}/${encodeURIComponent(accountSetting)}/${encodeURIComponent(ID)}`)
        .then(response => { return response.json() })
        .then(data => {
            addDetailsForm.style.display = 'none';
            setBookmakerToDone(bookmakerHolder);
        })
        .catch(error => {
            console.error('Problem with add bookmaker details fetch', error);
        });
    });
}

function setBookmakerToDone(bookmakerHolder) {

    let link = bookmakerHolder.querySelector('.bookmaker_link');
    let showFormButton = bookmakerHolder.querySelector('.show_form');

    if (link) {
        link.style.display = 'none';
    }

    showFormButton.style.display = 'none';

    let statusHolder = bookmakerHolder.querySelector('.bookmaker_status_holder');
    let statusText = bookmakerHolder.querySelector('.bookmaker_status_title');

    let depositText = bookmakerHolder.querySelector('.bookmaker_title.deposit');
    depositText.style.display = 'none';

    let skipButton = bookmakerHolder.querySelector('#skip-bookmaker-button');
    skipButton.style.display = 'none';

    statusText.textContent = 'DONE';    
    statusHolder.style.backgroundColor = '#77DD77';
    
    bookmakerHolder.classList.add("done");
    
}

function loadBookmakerAccounts(ID, accountName) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/getbookmakers/${encodeURIComponent(ID)}`)
    .then( response => { return response.json()})
    .then(data => {
        let isSuccess = data.success;
        let bookmakers = ['none'];

        if (isSuccess) {
            bookmakers = data.bookmakers;
        }
        
        let isCurrentStage = false;
        let i = 1;
        while (!isCurrentStage) {
            
            if (i === 10) {
                isCurrentStage = true;
                break;
            }
            let holderId = `stage-${i}-container`;

            let stageHolder = document.querySelector(`#${holderId}`);
            if (stageHolder) {
                let bookmakerHolders = stageHolder.querySelectorAll('.bookmaker_holder');
                bookmakerHolders.forEach(bookmakerHolder => {
                    let bookmakerTitle = bookmakerHolder.querySelector('.bookmaker_title').textContent;
                    let found = false;
                    found = bookmakers.some(item => item.bookmaker === bookmakerTitle);
                    
                    if (!found) {
                        isCurrentStage = true;
                        setBookmakerListener(ID, accountName, bookmakerHolder);
                        setSkipListner(ID, accountName, bookmakerHolder);
                    } else {
                        setBookmakerToDone(bookmakerHolder);
                    }

                });
            
                if (isCurrentStage) {
                    
                    fetch(`https://cmbettingoffers.pythonanywhere.com/getmoneyinfo/${encodeURIComponent(ID)}`)
                    .then(response => {  return response.json(); })
                    .then(data => {
                        let isSuccess = data.success;
                        if (isSuccess) {

                            let totalWithdrawals = document.querySelector('#deposits-withdrawal-counter')
                            let profitText = document.querySelector('#deposits-profit-counter')
                            let netBalanceText = document.querySelector('#deposits-net-counter')

                            profitText.textContent = `£${data.profit}`;
                            if (data.withdrawals) {
                                totalWithdrawals.textContent = `£${data.withdrawals}`;
                            }
                            netBalance = data.netposition;
                            netBalanceText.textContent = `£${netBalance}`;
                
                            stageHolder.style.display = 'flex';
                            stageHolder.style.flexDirection = 'column';
                            
                            let stageperc = (((i-1)/9)*100).toFixed(0);
                            let progressBarFill = document.querySelector('#background-fill');
                            if (progressBarFill) {
                                progressBarFill.style.width = `${stageperc}%`;
                            } else {
                                console.log('no fill bar found');
                            }
                            
                            let progressBarText = document.querySelector('.progressperc');
                            if (progressBarText) {
                                progressBarText.textContent = `${stageperc}%`;
                            }
                            checkFundsForStage(netBalance, stageHolder, ID);                        
                        } 
                    })
                    .catch(error => {
                        console.error('Problem with get money info fetch', error);
                    });

                    
                } else {
                    stageHolder.style.display = 'none';
                }
            } else {
                console.log('stage holder not found');
            }
            
            i++;
        };
            
    })
    .catch(error => {
        console.error('Problem with get bookmakers fetch', error);
    });
}

function checkUserStatus(ID, username) {

    let contactInfoBlock = document.querySelector('#contact-info-block');
    let contractInfoBlock = document.querySelector('#contract-info-block');
    let accountsInfoBlock = document.querySelector('#accounts-info-block');

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
                
                contactInfoBlock.style.display = 'none';

                accountsInfoBlock.style.display = 'flex';
                accountsInfoBlock.style.flexDirection = 'column';
                

                let disabledMenuItems = document.querySelectorAll('.menu_item_container.disabled');
                disabledMenuItems.forEach(disabledMenuItem => {
                    disabledMenuItem.style.display = "none";
                });
                
                let enabledMenuItems = document.querySelectorAll('.menu_item_container.enabled');
                enabledMenuItems.forEach(enabledMenuItem => {
                    enabledMenuItem.style.display = "block";
                });
            } else {
                
                contactInfoBlock.style.display = 'none';
                
                contractInfoBlock.style.display = 'flex';
                contractInfoBlock.style.flexDirection = 'column';

                
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
        let profitTitle = document.querySelector('#profit-title');

        if (isSuccess) {
            profitText = data.profit;
            profitTitle.textContent = `£${profitText}`;
        } else {
            profitTitle.textContent = "£0";
        }
    })
    .catch(error => {
        console.error('Problem with check profit fetch', error);
    })

}

function getDeposits(ID) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/getdeposits/${encodeURIComponent(ID)}`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        let isSuccess = data.success;
        
        if (isSuccess) {
            data.data.forEach(deposit => {

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
                            console.error('Problem with pending deposit fetch:', error);
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

            });
        }

    })
    .catch(error => {
        console.error('Problem with get deposits fetch:', error);
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

function addAffiliateListener(ID, affiliateForm, affiliateContainer) {

    let errorMessage = affiliateContainer.querySelector('#affiliate-error');

    affiliateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let codeApplied = affiliateForm.querySelector('#affiliate-form-value').value;
        fetch(`https://cmbettingoffers.pythonanywhere.com/addaffiliate/${encodeURIComponent(ID)}/${encodeURIComponent(codeApplied)}`)
        .then(response => {return response.json()})
        .then(data => {
            let isSuccess = data.success;

            if (isSuccess) {
                setUpAffiliates(ID);
            } else {
                errorMessage.style.display = "block";
            }
        })

    });
}

function setUpAffiliates(ID) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/affiliatedata/${encodeURIComponent(ID)}`)
    .then(response => {return response.json()})
    .then(data => {
        
        let isSuccess = data.success;
        
        let codeText = document.querySelector('#affiliate-code');
        let earningsText = document.querySelector('#affiliate-earnings');
        let signupsText = document.querySelector('#affiliate-signups');
        let affiliateContainer = document.querySelector('#affiliate-container');
        let affiliateHeader = document.querySelector('#affiliate-header');
        let affiliateForm = document.querySelector('#affiliate-form');

        if (isSuccess) {
            codeText.textContent = data.code;
            earningsText.textContent = `£${data.earnings}`;
            signupsText.textContent = data.signups;
            
            if (data.codeused) {
                affiliateContainer.style.backgroundColor = "#42d16d";
                affiliateForm.style.display = "none";
                affiliateHeader.textContent = "Affiliate Code Applied";
                affiliateHeader.style.color = "#303030";
            } else {
                addAffiliateListener(ID, affiliateForm, affiliateContainer);
            }

        } else {
            earningsText.textContent = "£0";
            signupsText.textContent = "0";
            codeText.textContent = 'affiliate code not found - please reload';
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
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
    loadBookmakerAccounts(ID, username);
    getDeposits(ID);
    setUpAffiliates(ID);

});