// Toggle auth box expand and tabs
(function(){
	function byId(id){ return document.getElementById(id); }
	const showLoginBtn = byId('showLogin');
	const showRegisterBtn = byId('showRegister');
	const authForms = byId('authForms');
	const authActions = byId('authActions');
	const closeBtn = byId('closeForms');
	if(!showLoginBtn || !showRegisterBtn || !authForms || !authActions){ return; }

	function openForms(defaultTab){
		authActions.style.display = 'none';
		authForms.classList.add('open');
		setActiveTab(defaultTab || 'login');
	}
	function closeForms(){
		authForms.classList.remove('open');
		authActions.style.display = 'flex';
	}
	function setActiveTab(tab){
		var loginTabBtn = document.querySelector('.auth-tabs .tab[data-tab="login"]');
		var registerTabBtn = document.querySelector('.auth-tabs .tab[data-tab="register"]');
		var loginPanel = byId('panel-login');
		var registerPanel = byId('panel-register');
		if(!loginTabBtn || !registerTabBtn || !loginPanel || !registerPanel) return;
		if(tab === 'login'){
			loginTabBtn.classList.add('active');
			registerTabBtn.classList.remove('active');
			loginPanel.classList.add('show');
			registerPanel.classList.remove('show');
		}else{
			registerTabBtn.classList.add('active');
			loginTabBtn.classList.remove('active');
			registerPanel.classList.add('show');
			loginPanel.classList.remove('show');
		}
	}

	showLoginBtn.addEventListener('click', function(){ openForms('login'); });
	showRegisterBtn.addEventListener('click', function(){ openForms('register'); });
	if(closeBtn){ closeBtn.addEventListener('click', function(){ closeForms(); }); }

	var tabButtons = document.querySelectorAll('.auth-tabs .tab');
	tabButtons.forEach(function(btn){
		btn.addEventListener('click', function(){ setActiveTab(btn.getAttribute('data-tab')); });
	});
})();
