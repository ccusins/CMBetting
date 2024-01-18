function setUpDepositListener(token) {

    const findDepositsForm = document.getElementById('support-find-deposits')
    findDepositsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const depositsUserId = document.getElementById('support-find-id').value;
        fetch(`https://cmbettingoffers.pythonanywhere.com/getdeposits/${encodeURIComponent(depositsUserId)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let isSuccess = data.success;
            if (isSuccess) {

                let depositsContainer = document.querySelector('.support_deposits_container');
                let depositsTemplate = document.querySelector('.support_template_deposit_container');     
                
                data.data.forEach(itemData => {

                    let bookmaker = itemData.bookmaker;
                    let amount = itemData.amount;
                    let status = itemData.status;

                    const newDeposit = depositsTemplate.cloneNode(true);

                    let bookmakerText = newDeposit.querySelector('.support_deposit_text.bookmaker')
                    bookmakerText.textContent = bookmaker;

                    let amountText = newDeposit.querySelector('.support_deposit_text.amount')
                    amountText.textContent = amount;

                    let statusText = newDeposit.querySelector('.support_deposit_text.status')
                    statusText.textContent = status;
                    
                    if (status === 'uncompleted') {
                        statusText.style.backgroundColor = '#EE746E';
                    } else if (status === 'pending') {
                        statusText.style.backgroundColor = '#FF954F';
                    } else {
                        statusText.style.backgroundColor = '#77DD77';
                    }
                    
                    newDeposit.style.display = "block";
                    depositsContainer.appendChild(newDeposit);

                    let confirmDepositButton = newDeposit.querySelector('#confirm-button-deposit')
                    confirmDepositButton.addEventListener('click', function() {
                        fetch(`https://cmbettingoffers.pythonanywhere.com/pendingdeposit/${encodeURIComponent(token)}/${encodeURIComponent(depositsUserId)}/${encodeURIComponent(bookmaker)}/done`)
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);                
                        })
                    });
                });

            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        
    });    

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
                    
                    let accountDepositForm = newAccount.querySelector('#support-add-deposit');
                    accountDepositForm.addEventListener('submit', function(e) {
                        e.preventDefault();

                        let bookieAmount = accountDepositForm.querySelector('#support-add-deposit-amount').value;
                        fetch(`https://cmbettingoffers.pythonanywhere.com/newdeposit/${encodeURIComponent(accountsUserId)}/${encodeURIComponent(bookmaker)}/${encodeURIComponent(bookieAmount)}`)
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);                
                        })
                        accountDepositForm.style.display = "none";
                    })

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

                  let profitForm = newUser.querySelector('#support-users-profit-form');
                  profitForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    fetch(`https://cmbettingoffers.pythonanywhere.com/checkprofit/${encodeURIComponent(itemData.userid)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                          }
                        return response.json()
                    })
                    .then(data => {
                        let isSuccess = data.success;
                        if (isSuccess) {
                            console.log(data);
                            let profit = parseFloat(data.profit);

                            let addProfitValue = parseFloat(profitForm.querySelector('#support-users-profit-value').value);
                            console.log(addProfitValue);
                            profit += addProfitValue;
                            fetch(`https://cmbettingoffers.pythonanywhere.com/adduserprofit/${encodeURIComponent(token)}/${encodeURIComponent(itemData.userid)}/£${encodeURIComponent(profit)}`)
                            .catch(error => {
                                console.error('There has been a problem with your fetch operation:', error);
                            })
                            


                        }
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    })
                    profitForm.style.display = "none";
                  });

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
    
    const token = process.env.API_KEY;
    getUsers(token);
    setUpDepositListener(token);
    setUpAccountListener(token);
    
}); 

