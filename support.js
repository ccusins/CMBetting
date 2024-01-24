function addDepositListener(token, accountsUserId, bookmaker, newAccount) {
    
    let accountDepositForm = newAccount.querySelector('#support-add-deposit');
    accountDepositForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let bookieAmount = accountDepositForm.querySelector('#support-add-deposit-amount').value;
        fetch(`https://cmbettingoffers.pythonanywhere.com/newdeposit/${encodeURIComponent(accountsUserId)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(bookieAmount)}`)
        .then(response => { return response.json() })
        .then(data => {
            loadDeposits(token, accountsUserId, bookmaker, newAccount);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);                
        })
    });

}

function setAccountProgress(token, accountsUserId, bookmaker, newAccount) {

    fetch(`https://cmbettingoffers.pythonanywhere.com/checkaccountprogress/${encodeURIComponent(token)}/${encodeURIComponent(accountsUserId)}/${encodeURIComponent(bookmaker)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(progressdata => {
    
        let isSuccess = progressdata.success;
        let bookmakerStatusText = newAccount.querySelector('.support_accounts_text.status');
        let bookmakerProgressForm = newAccount.querySelector('#support-account-progress-form');
    
        if (isSuccess) {

            let progressStatus = progressdata.status;
            bookmakerStatusText.textContent = progressStatus;
            
            if (progressStatus === 'qb not placed') {
                bookmakerStatusText.style.backgroundColor = '#EE746E';
            } else if (progressStatus === 'qb placed') {
                bookmakerStatusText.style.backgroundColor = '#FF954F';
            } else {
                bookmakerStatusText.style.backgroundColor = '#77DD77';
            }

            
            bookmakerProgressForm.addEventListener('submit', function(e) {
                e.preventDefault();

                let newProgressStatus = bookmakerProgressForm.querySelector('#support-account-progress-value').value;

                fetch(`https://cmbettingoffers.pythonanywhere.com/changeaccountprogress/${encodeURIComponent(token)}/${encodeURIComponent(accountsUserId)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(newProgressStatus)}`)
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                })

                bookmakerStatusText.textContent = newProgressStatus;
                if (newProgressStatus === 'qb not placed') {
                    bookmakerStatusText.style.backgroundColor = '#EE746E';
                } else if (newProgressStatus === 'qb placed') {
                    bookmakerStatusText.style.backgroundColor = '#FF954F';
                } else {
                    bookmakerStatusText.style.backgroundColor = '#77DD77';
                }
            });

        } else {
            bookmakerStatusText.textContent = "qb not placed";
            bookmakerStatusText.style.backgroundColor = '#EE746E';
        }

        
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    })

}

function loadWithdrawals(token, userid, bookmaker, newAccount) {
    
    let depositContainer = newAccount.querySelector('.support_menu_container.deposits');
    depositContainer.style.display = "none";

    let profitContainer = newAccount.querySelector('.support_menu_container.profit');
    profitContainer.style.display = "none";

    let withdrawalContainer = newAccount.querySelector('.support_menu_container.withdrawals');
    withdrawalContainer.innerHTML = '';
    let withdrawalTemplate = newAccount.querySelector('.support_menu_template.withdrawal');

    withdrawalContainer.style.display = "flex";
    withdrawalContainer.style.flexDirection = "column";
    let totalWithdrawals = 0;

    fetch(`https://cmbettingoffers.pythonanywhere.com/getwithdrawals/${encodeURIComponent(token)}/${encodeURIComponent(userid)}/${encodeURIComponent(bookmaker)}`)
    .then(response => {return response.json()})
    .then(data => {
        
        let isSuccess = data.success;

        if (isSuccess) {
            data.withdrawals.forEach(withdrawal => {

                let newWithdrawal = withdrawalTemplate.cloneNode(true);

                let totalText = newWithdrawal.querySelector('.support_menu_text.total')
                totalText.style.display = 'none';

                let amountText = newWithdrawal.querySelector('.support_menu_text.amount')

                amountText.textContent = `£${withdrawal.amount}`;

                totalWithdrawals += parseFloat(withdrawal.amount);
                
                newWithdrawal.style.display = "flex";
                newWithdrawal.style.flexDirection = "row";

                withdrawalContainer.appendChild(newWithdrawal);
            });

            let totalWithdrawalNode = withdrawalTemplate.cloneNode(true);

            let totalText = totalWithdrawalNode.querySelector('.support_menu_text.total');
            totalText.textContent = `Total Withdrawals: £${totalWithdrawals}`
            totalText.style.color = 'black';

            let amountText = totalWithdrawalNode.querySelector('.support_menu_text.amount')
            amountText.style.display = "none";

            totalWithdrawalNode.style.display = "flex";
            totalWithdrawalNode.style.flexDirection = "row";

            totalWithdrawalNode.style.backgroundColor = 'lightgreen';

            withdrawalContainer.appendChild(totalWithdrawalNode);

        }

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

function setWithdrawalListener(token, userid, bookmaker, newAccount) {

    let withdrawalForm = newAccount.querySelector('#support-withdrawal-form');

    withdrawalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let amount = withdrawalForm.querySelector('#support-withdrawal-amount').value;
        
        if (amount) {
        
            fetch(`https://cmbettingoffers.pythonanywhere.com/addwithdrawal/${encodeURIComponent(token)}/${encodeURIComponent(userid)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(amount)}`)
            .then(response => { return response.json() })
            .then(data => {
                loadWithdrawals(token, userid, bookmaker, newAccount);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        }
    });


}

function loadDeposits(token, userid, bookmaker, newAccount) {

    let withdrawalContainer = newAccount.querySelector('.support_menu_container.withdrawals')
    withdrawalContainer.style.display = 'none';

    let profitContainer = newAccount.querySelector('.support_menu_container.profit');
    profitContainer.style.display = "none";

    let depositContainer = newAccount.querySelector('.support_menu_container.deposits');
    let depositTemplate = newAccount.querySelector('.support_menu_template.deposits');

    depositContainer.innerHTML = '';

    depositContainer.style.display = "flex";
    depositContainer.style.flexDirection = "column";


    fetch(`https://cmbettingoffers.pythonanywhere.com/getaccountdeposits/${encodeURIComponent(userid)}/${encodeURIComponent(bookmaker)}`)
    .then(response => {return response.json()})
    .then(data => {
        let isSuccess = data.success;
        if (isSuccess) {
            data.deposits.forEach(deposit => {
                
                let amount = deposit.amount;
                let status = deposit.status;

                let newDeposit = depositTemplate.cloneNode(true);

                let amountText = newDeposit.querySelector('h1.support_menu_text.amount')
                let statusText = newDeposit.querySelector('h1.support_menu_text.status')

                amountText.textContent = `£${amount}`;
                
                let completeButton = newDeposit.querySelector('.support_menu_complete_button')

                let setListener = true;
                statusText.textContent = status;
                if (status === 'uncompleted') {
                    statusText.style.backgroundColor = '#EE746E'
                } else if (status === 'pending') {
                    statusText.style.backgroundColor = '#FF954F';
                } else {
                    statusText.style.backgroundColor = '#77DD77';
                    completeButton.style.display = "none";
                    setListener = false;
                }
                
                newDeposit.style.display = 'flex';
                newDeposit.style.flexDirection = "row";
                newDeposit.classList.add('deposit-element');

                depositContainer.appendChild(newDeposit);

                if (setListener) {
                    
                    completeButton.addEventListener('click', function() {
                        fetch(`https://cmbettingoffers.pythonanywhere.com/confirmdeposit/${encodeURIComponent(token)}/${encodeURIComponent(userid)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(amount)}`)
                        .then(response => { return response.json() })
                        .then(data => {
                            loadDeposits(token, userid, bookmaker, newAccount);
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });

                    });
                }
            });
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

function setProfitListener(token, userid, bookmaker, newAccount) {

    let profitForm = newAccount.querySelector('#support-profit-form');

    profitForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let amount = profitForm.querySelector('#support-profit-amount').value;
        let ratio = profitForm.querySelector('#support-profit-ratio').value;

        fetch(`https://cmbettingoffers.pythonanywhere.com/addbookmakerprofit/${encodeURIComponent(token)}/${encodeURIComponent(userid)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(amount)}/${encodeURIComponent(ratio)}`)
        .then(response => { return response.json(); })
        .then(data => {
            loadProfit(token, userid, bookmaker, newAccount);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
}

function loadProfit(token, userid, account, newAccount) {

    let withdrawalContainer = newAccount.querySelector('.support_menu_container.withdrawals')
    withdrawalContainer.style.display = 'none';
    
    let depositContainer = newAccount.querySelector('.support_menu_container.deposits');
    depositContainer.style.display = 'none';
    
    let profitContainer = newAccount.querySelector('.support_menu_container.profit');
    profitContainer.innerHTML = '';
    profitContainer.style.display = "flex";
    profitContainer.style.flexDirection = "column";

    let profitTemplate = newAccount.querySelector('.support_menu_template.profit')

    fetch(`https://cmbettingoffers.pythonanywhere.com/checkbookmakerprofit/${encodeURIComponent(token)}/${encodeURIComponent(userid)}/${encodeURIComponent(account)}`)
    .then(response => { return response.json() })
    .then(data => {
        let isSuccess = data.success;
        if (isSuccess) {
            
            let profitHolder = profitTemplate.cloneNode(true);
            profitHolder.style.display = 'flex';
            profitHolder.style.flexDirection = 'column';

            let profitText = profitHolder.querySelector('h1.support_menu_text.profit_text');
            profitText.textContent = `Account Profit: £${data.profit}`;
            
            profitContainer.appendChild(profitHolder);

        }
    })


}

function setUpAccountListener(token) {
    
    const findAccountsForm = document.getElementById('support-find-accounts')
    findAccountsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const accountsUserId = document.getElementById('support-find-id-accounts').value;
        fetch(`https://cmbettingoffers.pythonanywhere.com/getbookmakerdetails/${encodeURIComponent(token)}/${encodeURIComponent(accountsUserId)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            let isSuccess = data.success;

            if (isSuccess) {
                data.data.forEach(itemData => {
                    
                    let bookmakerTemplate = document.querySelector('.support_template_accounts_container');
                    let bookmakerContainer = document.querySelector('.support_accounts_container');

                    let bookmaker = itemData.bookmaker;
                    let bookmakerUsername = itemData.bookmakerUsername;
                    let bookmakerEmail = itemData.bookmakerEmail;
                    let bookmakerPassword = itemData.bookmakerPassword;

                    const newAccount = bookmakerTemplate.cloneNode(true);
                    
                    setAccountProgress(token, accountsUserId, bookmaker, newAccount);

                    let bookmakerText = newAccount.querySelector('.support_accounts_text.bookmaker');
                    bookmakerText.textContent = bookmaker;
                    
                    let bookmakerEmailText = newAccount.querySelector('.support_accounts_text.bookmaker_email');
                    bookmakerEmailText.textContent = bookmakerUsername;

                    let bookmakerUsernameText = newAccount.querySelector('.support_accounts_text.bookmaker_username');
                    bookmakerUsernameText.textContent = bookmakerEmail;

                    let bookmakerPasswordText = newAccount.querySelector('.support_accounts_text.bookmaker_password');
                    bookmakerPasswordText.textContent = bookmakerPassword;
                    
                    newAccount.style.display = "block";
                    bookmakerContainer.appendChild(newAccount);
                    
                    addDepositListener(token, accountsUserId, bookmaker, newAccount);
                    setProfitListener(token, accountsUserId, bookmaker, newAccount);
                    setWithdrawalListener(token, accountsUserId, bookmaker, newAccount);

                    let showDepositsButton = newAccount.querySelector('.support_menu_button.deposits');
                    let showWithdrawalsButton = newAccount.querySelector('.support_menu_button.withdrawals');
                    let showProfitButton = newAccount.querySelector('.support_menu_button.profit')
                    
                    showDepositsButton.addEventListener('click', function() {

                        showDepositsButton.style.backgroundColor = 'white';
                        showDepositsButton.style.color = '#303030';

                        showWithdrawalsButton.style.backgroundColor = 'transparent';
                        showWithdrawalsButton.style.color = 'white';

                        showProfitButton.style.backgroundColor = 'transparent';
                        showProfitButton.style.color = 'white';

                        loadDeposits(token, accountsUserId, bookmaker, newAccount);
                    });

                    
                    showWithdrawalsButton.addEventListener('click', function() {
                        
                        showWithdrawalsButton.style.backgroundColor = 'white';
                        showWithdrawalsButton.style.color = '#303030';

                        showDepositsButton.style.backgroundColor = 'transparent';
                        showDepositsButton.style.color = 'white';
                        
                        showProfitButton.style.backgroundColor = 'transparent';
                        showProfitButton.style.color = 'white';

                        loadWithdrawals(token, accountsUserId, bookmaker, newAccount);
                    });
                    
                    showProfitButton.addEventListener('click', function() {

                        showProfitButton.style.backgroundColor = 'white'
                        showProfitButton.style.color = '#303030';

                        showWithdrawalsButton.style.backgroundColor = 'transparent';
                        showWithdrawalsButton.style.color = 'white';

                        showDepositsButton.style.backgroundColor = 'transparent';
                        showDepositsButton.style.color = 'white';

                        loadProfit(token, accountsUserId, bookmaker, newAccount);     
                    });
                    
                });
                
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        })

    })


}

function getUsers(token) {

  const usersContainer = document.getElementById('support-users-container');
  const usersTemplate = document.getElementById('support-users-template');

  fetch(`https://cmbettingoffers.pythonanywhere.com/getusers/${encodeURIComponent(token)}`)
    
  .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

    .then(data => {

        let isSuccess = data.success;
        if (isSuccess) {

          data.data.forEach(itemData => {

            const newUser = usersTemplate.cloneNode(true);

            let notSignedContract = false;
            let notSentBank = false;

            newUser.querySelector('.support.name').textContent = itemData.username;
            newUser.querySelector('.support.id').textContent = itemData.userid;
            newUser.querySelector('.support.phone').textContent = itemData.phone;
            newUser.querySelector('.support.email').textContent = itemData.email;

            fetch(`https://cmbettingoffers.pythonanywhere.com/checkstatus/${encodeURIComponent(itemData.userid)}`)

            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })

            .then(data => {

              let isSuccess = data.success;
              if (isSuccess) {

                  let contract = data.contract;
                  let bank = data.bank;

                  let contractText = newUser.querySelector('.support.contract.status');
                  let bankText = newUser.querySelector('.support.bank.status');

                  contractText.textContent = contract;
                  bankText.textContent = bank;

                  if (bank !== 'done') {
                    bankText.style.backgroundColor = '#EE746E';
                      notSentBank = true;
                  } else {
                    bankText.style.backgroundColor = '#77DD77';
                  }

                  if (contract !== 'done') {
                    contractText.style.backgroundColor = '#EE746E';
                    notSignedContract = true; 
                  } else {
                    contractText.style.backgroundColor = '#77DD77';
                  }

                  newUser.style.display = 'block';

                  usersContainer.appendChild(newUser);
                  
                  let contractButton = newUser.querySelector('#support-contract-button');
                  let bankButton = newUser.querySelector('#support-bank-button');

                  if (notSignedContract) {

                    contractButton.addEventListener('click', function() {

                      fetch(`https://cmbettingoffers.pythonanywhere.com/completesetup/${encodeURIComponent(token)}/${encodeURIComponent(itemData.userid)}/contract`)
                      .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                      });  
                    
                      contractButton.style.display = "none";
                    
                    });

                  } else {
                    contractButton.style.display = "none";
                  }

                  if (notSentBank) {

                    bankButton.addEventListener('click', function() {

                      fetch(`https://cmbettingoffers.pythonanywhere.com/completesetup/${encodeURIComponent(token)}/${encodeURIComponent(itemData.userid)}/bank`)
                      .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                      });  

                    	bankButton.style.display = "none";

                    });
                  } else {
                    bankButton.style.display = "none";
                  }  
              }

            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });           
            
            });
        }
    })
    
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() { 
    
    let token = document.querySelector('.support.token.text').textContent;
    getUsers(token); 
    setUpAccountListener(token);
    
}); 

