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

// Dynamic Doodle Animation
(function(){
	const doodleAnimation = document.getElementById('doodleAnimation');
	if (!doodleAnimation) return;
	
	let isAnimating = true;
	let animationSpeed = 1;
	
	// Randomize animation speeds periodically
	function randomizeAnimation() {
		if (!isAnimating) return;
		
		// Randomly change animation speeds for all elements
		const circles = doodleAnimation.querySelectorAll('.doodle-circle');
		const lines = doodleAnimation.querySelectorAll('.doodle-line');
		const dots = doodleAnimation.querySelectorAll('.doodle-dot');
		const triangles = doodleAnimation.querySelectorAll('.doodle-triangle');
		const squares = doodleAnimation.querySelectorAll('.doodle-square');
		const waves = doodleAnimation.querySelectorAll('.doodle-wave');
		const sparkles = doodleAnimation.querySelectorAll('.doodle-sparkle');
		
		circles.forEach(circle => {
			const randomDuration = (Math.random() * 4 + 4) + 's';
			circle.style.animationDuration = randomDuration;
		});
		
		lines.forEach(line => {
			const randomDuration = (Math.random() * 2 + 2) + 's';
			line.style.animationDuration = randomDuration;
		});
		
		dots.forEach(dot => {
			const randomDuration = (Math.random() * 1.5 + 1.5) + 's';
			dot.style.animationDuration = randomDuration;
		});
		
		triangles.forEach(triangle => {
			const randomDuration = (Math.random() * 3 + 3) + 's';
			triangle.style.animationDuration = randomDuration;
		});
		
		squares.forEach(square => {
			const randomDuration = (Math.random() * 2.5 + 2.5) + 's';
			square.style.animationDuration = randomDuration;
		});
		
		waves.forEach(wave => {
			const randomDuration = (Math.random() * 1.5 + 1.5) + 's';
			wave.style.animationDuration = randomDuration;
		});
		
		sparkles.forEach(sparkle => {
			const randomDuration = (Math.random() * 2 + 2) + 's';
			sparkle.style.animationDuration = randomDuration;
		});
		
		// Randomize again in 8-12 seconds
		setTimeout(randomizeAnimation, Math.random() * 4000 + 8000);
	}
	
	// Add hover effects
	doodleAnimation.addEventListener('mouseenter', function() {
		animationSpeed = 0.5;
		doodleAnimation.style.animationDuration = '4s';
	});
	
	doodleAnimation.addEventListener('mouseleave', function() {
		animationSpeed = 1;
		doodleAnimation.style.animationDuration = '8s';
	});
	
	// Add click interaction with enhanced effects
	doodleAnimation.addEventListener('click', function(e) {
		// Create multiple ripple effects
		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
				const ripple = document.createElement('div');
				ripple.style.cssText = `
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					border: 2px solid rgba(255,255,255,0.6);
					border-radius: 50%;
					transform: translate(-50%, -50%);
					animation: ripple 1s ease-out;
					pointer-events: none;
				`;
				doodleAnimation.appendChild(ripple);
				
				setTimeout(() => {
					if (ripple.parentNode) {
						ripple.parentNode.removeChild(ripple);
					}
				}, 1000);
			}, i * 200);
		}
		
		// Create floating particles
		createFloatingParticles(e.offsetX, e.offsetY);
		
		// Temporarily speed up all animations
		const allElements = doodleAnimation.querySelectorAll('*');
		allElements.forEach(el => {
			el.style.animationDuration = '0.5s';
		});
		
		setTimeout(() => {
			allElements.forEach(el => {
				el.style.animationDuration = '';
			});
		}, 2000);
	});
	
	// Create floating particles effect
	function createFloatingParticles(x, y) {
		const particles = ['✨', '⭐', '💫', '✨', '⭐'];
		
		particles.forEach((particle, index) => {
			setTimeout(() => {
				const particleEl = document.createElement('div');
				particleEl.textContent = particle;
				particleEl.style.cssText = `
					position: absolute;
					left: ${x}px;
					top: ${y}px;
					font-size: 20px;
					pointer-events: none;
					animation: particleFloat 2s ease-out forwards;
					z-index: 1000;
				`;
				
				// Add particle animation
				const style = document.createElement('style');
				style.textContent = `
					@keyframes particleFloat {
						0% { 
							transform: translate(0, 0) scale(1) rotate(0deg); 
							opacity: 1; 
						}
						100% { 
							transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0.3) rotate(360deg); 
							opacity: 0; 
						}
					}
				`;
				document.head.appendChild(style);
				
				doodleAnimation.appendChild(particleEl);
				
				setTimeout(() => {
					if (particleEl.parentNode) {
						particleEl.parentNode.removeChild(particleEl);
					}
				}, 2000);
			}, index * 100);
		});
	}
	
	// Start randomizing after initial load
	setTimeout(randomizeAnimation, 2000);
	
	// Pause animation when page is not visible (performance optimization)
	document.addEventListener('visibilitychange', function() {
		if (document.hidden) {
			isAnimating = false;
			doodleAnimation.style.animationPlayState = 'paused';
		} else {
			isAnimating = true;
			doodleAnimation.style.animationPlayState = 'running';
			randomizeAnimation();
		}
	});
})();

// Elegant Greeting Text Interactive Effects
(function(){
	const greetingText = document.getElementById('greetingText');
	if (!greetingText) return;
	
	let isHovered = false;
	let clickCount = 0;
	
	// Enhanced hover effect with smooth transitions
	greetingText.addEventListener('mouseenter', function() {
		isHovered = true;
		this.style.transform = 'translateY(-5px) scale(1.05)';
		this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
		this.style.filter = 'brightness(1.2) saturate(1.3)';
	});
	
	greetingText.addEventListener('mouseleave', function() {
		isHovered = false;
		this.style.transform = 'translateY(0px) scale(1)';
		this.style.filter = 'brightness(1) saturate(1)';
	});
	
	// Enhanced click effect with multiple animations
	greetingText.addEventListener('click', function() {
		clickCount++;
		
		// Create elegant ripple effect
		createElegantRipple(this);
		
		// Create floating particles
		createFloatingParticles(this);
		
		// Add text shake effect
		this.style.animation = 'elegantShake 0.6s ease-in-out';
		setTimeout(() => {
			this.style.animation = '';
		}, 600);
		
		// Speed up all animations temporarily
		this.style.animationDuration = '0.3s';
		setTimeout(() => {
			this.style.animationDuration = '';
		}, 2000);
		
		// Add special effect for multiple clicks
		if (clickCount % 3 === 0) {
			createSpecialEffect(this);
		}
	});
	
	// Create elegant ripple effect
	function createElegantRipple(element) {
		const rect = element.getBoundingClientRect();
		const ripple = document.createElement('div');
		ripple.style.cssText = `
			position: fixed;
			top: ${rect.top + rect.height/2}px;
			left: ${rect.left + rect.width/2}px;
			width: 0;
			height: 0;
			border: 2px solid rgba(255,255,255,0.6);
			border-radius: 50%;
			transform: translate(-50%, -50%);
			animation: elegantRipple 2s ease-out;
			pointer-events: none;
			z-index: 1000;
		`;
		
		document.body.appendChild(ripple);
		
		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 2000);
	}
	
	// Create floating particles
	function createFloatingParticles(element) {
		const rect = element.getBoundingClientRect();
		const particles = ['✨', '⭐', '💫', '✨', '⭐', '🌟'];
		
		particles.forEach((particle, index) => {
			setTimeout(() => {
				const particleEl = document.createElement('div');
				particleEl.textContent = particle;
				particleEl.style.cssText = `
					position: fixed;
					left: ${rect.left + rect.width/2}px;
					top: ${rect.top + rect.height/2}px;
					font-size: 18px;
					pointer-events: none;
					animation: elegantParticleFloat 3s ease-out forwards;
					z-index: 1000;
				`;
				
				document.body.appendChild(particleEl);
				
				setTimeout(() => {
					if (particleEl.parentNode) {
						particleEl.parentNode.removeChild(particleEl);
					}
				}, 3000);
			}, index * 100);
		});
	}
	
	// Create special effect for multiple clicks
	function createSpecialEffect(element) {
		const rect = element.getBoundingClientRect();
		const specialEffect = document.createElement('div');
		specialEffect.style.cssText = `
			position: fixed;
			top: ${rect.top}px;
			left: ${rect.left}px;
			width: ${rect.width}px;
			height: ${rect.height}px;
			background: linear-gradient(45deg, rgba(255,107,107,0.3), rgba(78,205,196,0.3), rgba(69,183,209,0.3));
			border-radius: 20px;
			animation: elegantSpecialEffect 1.5s ease-out;
			pointer-events: none;
			z-index: 999;
		`;
		
		document.body.appendChild(specialEffect);
		
		setTimeout(() => {
			if (specialEffect.parentNode) {
				specialEffect.parentNode.removeChild(specialEffect);
			}
		}, 1500);
	}
	
	// Add CSS animations
	const style = document.createElement('style');
	style.textContent = `
		@keyframes elegantRipple {
			0% { 
				width: 0; 
				height: 0; 
				opacity: 1; 
				border-color: rgba(255,255,255,0.8);
			}
			50% { 
				width: 200px; 
				height: 200px; 
				opacity: 0.6; 
				border-color: rgba(78,205,196,0.6);
			}
			100% { 
				width: 400px; 
				height: 400px; 
				opacity: 0; 
				border-color: rgba(69,183,209,0.2);
			}
		}
		
		@keyframes elegantParticleFloat {
			0% { 
				transform: translate(0, 0) scale(1) rotate(0deg); 
				opacity: 1; 
			}
			100% { 
				transform: translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) scale(0.2) rotate(720deg); 
				opacity: 0; 
			}
		}
		
		@keyframes elegantShake {
			0%, 100% { transform: translateX(0); }
			25% { transform: translateX(-5px) rotate(-1deg); }
			75% { transform: translateX(5px) rotate(1deg); }
		}
		
		@keyframes elegantSpecialEffect {
			0% { 
				opacity: 0; 
				transform: scale(0.8);
			}
			50% { 
				opacity: 0.8; 
				transform: scale(1.1);
			}
			100% { 
				opacity: 0; 
				transform: scale(1.3);
			}
		}
	`;
	document.head.appendChild(style);
	
	// Add subtle animation on page load
	setTimeout(() => {
		greetingText.style.animation = 'elegantFloat 3s ease-in-out infinite, elegantColorShift 4s ease-in-out infinite';
	}, 1000);
})();

