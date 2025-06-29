document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP: Check for touch device ---
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --- CURSOR ---
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");

    if (!isTouchDevice) {
        window.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top = `${clientY}px`;
            cursorOutline.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 400, fill: "forwards" });
        });

        const interactiveElements = 'a, button, .interactive-card, .theme-button, .partner-item, .swiper-button-prev, .swiper-button-next, .timeline-card, .faq-question';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-effect'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-effect'));
        });
    } else {
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }


    // --- NAVBAR SCROLL & MOBILE MENU ---
    const mainNav = document.getElementById('main-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mainNav) {
        window.addEventListener('scroll', () => {
            mainNav.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('open');
            navMenu.classList.toggle('active', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('open');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- ANIMATION OBSERVER ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('animated-headline')) {
                    animateHeadline(entry.target);
                }
                if (entry.target.classList.contains('timeline-item')) {
                    updateTimelineProgress();
                }
                if (!entry.target.classList.contains('timeline-item')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { rootMargin: "0px 0px -10% 0px" });

    function animateHeadline(headline) {
        if (headline.dataset.animated) return;
        headline.dataset.animated = true;
        const text = headline.textContent;
        headline.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${i * 25}ms`;
            headline.appendChild(span);
        });
    }
    document.querySelectorAll('.animate-on-scroll, .animated-headline, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // --- DYNAMIC CONTENT GENERATION ---

    // --- COUNTDOWN TIMER ---
    function generateCountdown() {
        const countdownContainer = document.getElementById('countdown-timer');
        if (!countdownContainer) return;
        const countDownDate = new Date("Jul 22, 2025 23:59:59").getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            if (distance < 0) {
                clearInterval(interval);
                countdownContainer.innerHTML = "<div style='font-size: 1.5em;'>CUỘC THI ĐÃ BẮT ĐẦU!</div>";
                return;
            }
            const days = String(Math.floor(distance / 86400000)).padStart(2, '0');
            const hours = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
            const minutes = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
            countdownContainer.innerHTML = `<div class="countdown-item"><span>${days}</span><p>Ngày</p></div><div class="countdown-item"><span>${hours}</span><p>Giờ</p></div><div class="countdown-item"><span>${minutes}</span><p>Phút</p></div><div class="countdown-item"><span>${seconds}</span><p>Giây</p></div>`;
        }, 1000);
    }
    
    // --- THEMES SECTION (UPDATED) ---
    // ./assets/js/script.js

function generateThemes() {
    const themesData = [
        { icon: 'fa-leaf', title: 'Tech4Life', img: './assets/images/topics/tech4life.jpg', details: 'Các giải pháp công nghệ nhằm giải quyết các thách thức về môi trường, thúc đẩy sử dụng tài nguyên hiệu quả, phát triển đô thị thông minh bền vững, và xây dựng một tương lai xanh hơn cho Việt Nam. Ví dụ: AI tối ưu hóa việc thu gom và xử lý rác thải đô thị; Hệ thống điều phối giao thông thông minh giảm ùn tắc và khí thải; Mạng lưới cảm biến IoT giám sát và cảnh báo sớm ô nhiễm môi trường; Nền tảng trực tuyến thúc đẩy kinh tế tuần hoàn qua tái chế và tái sử dụng Ứng dụng di động khuyến khích và theo dõi các lựa chọn di chuyển xanh,...' }, 
        { icon: 'fa-suitcase-medical', title: 'Tech4Health', img: './assets/images/topics/tech4health.jpg', details: 'Các giải pháp công nghệ đột phá nhằm cải thiện chất lượng dịch vụ y tế, nâng cao khả năng chẩn đoán sớm, cá nhân hóa điều trị, quản lý sức khỏe chủ động và tăng cường khả năng tiếp cận y tế cho mọi người dân. Ví dụ: AI hỗ trợ phân tích hình ảnh y tế để phát hiện sớm bệnh lý; Giải pháp khám chữa bệnh từ xa toàn diện, tích hợp theo dõi sức khỏe IoT; Thiết bị thông minh tại nhà hỗ trợ tuân thủ lịch uống thuốc; Ứng dụng AI chatbot cung cấp hỗ trợ tâm lý cơ bản và kết nối chuyên gia; Hệ thống AI cảnh báo sớm dịch bệnh dựa trên phân tích dữ liệu đa nguồn,...'}, 
        { icon: 'fa-school', title: 'Tech4Edu', img: './assets/images/topics/tech4edu.jpg', details: 'Các giải pháp công nghệ nhằm đổi mới phương pháp dạy và học, cá nhân hóa trải nghiệm giáo dục, phát triển kỹ năng, và xây dựng một hệ sinh thái học tập suốt đời. Ví dụ: Nền tảng học tập thích ứng dùng AI cá nhân hóa lộ trình và nội dung học; Nền tảng AI kết nối người học với mentor chuyên gia và theo dõi tiến độ; Ứng dụng/game giáo dục dạy lập trình cho trẻ em một cách trực quan, sáng tạo; Nền tảng AI định hướng nghề nghiệp dựa trên phân tích sở thích và năng lực; Giải pháp xây dựng cộng đồng học tập trực tuyến, chia sẻ tài nguyên,...' }, 
        { icon: 'fa-user-check', title: 'Tech4CX', img: './assets/images/topics/tech4cx.jpg', details: 'Các giải pháp công nghệ nhằm tạo ra trải nghiệm khách hàng vượt trội, liền mạch trên đa kênh, đồng thời tối ưu hóa quy trình vận hành nội bộ, tăng năng suất và hiệu quả kinh doanh. Ví dụ: Trợ lý ảo AI đa kênh hỗ trợ khách hàng và cá nhân hóa trải nghiệm 24/7; Hệ thống AI phân tích dữ liệu để cá nhân hóa nội dung và ưu đãi; Giải pháp AR cho phép khách hàng thử sản phẩm ảo trước khi mua; Nền tảng phân tích dữ liệu tại cửa hàng (AI, IoT) để tối ưu vận hành bán lẻ; Nền tảng RPA tự động hóa các quy trình lặp đi lặp lại trong văn phòng,...'}, 
        { icon: 'fa-handshake-angle', title: 'Tech4Inclusion', img: './assets/images/topics/tech4inclusion.jpg', details: 'Các giải pháp công nghệ sáng tạo nhằm hỗ trợ người khuyết tật, người cao tuổi, và các nhóm yếu thế khác vượt qua rào cản, cải thiện chất lượng cuộc sống, tăng cường khả năng tiếp cận giáo dục, y tế, việc làm và hòa nhập cộng đồng. Ví dụ: Nền tảng giáo dục trực tuyến với giao diện và nội dung thích ứng cho người yếu thế; Trợ lý ảo AI đồng hành, cung cấp hỗ trợ sức khỏe tinh thần cho người cô đơn/cao tuổi; Nền tảng phục hồi chức năng từ xa kết nối bệnh nhân với chuyên gia trị liệu; Hệ thống nhà thông minh điều khiển bằng giọng nói/cử chỉ, tích hợp cảnh báo an toàn; Công cụ AI hỗ trợ trẻ em yếu thế sáng tạo, thể hiện bản thân và học tập,...' }
    ];
    const container = document.getElementById('themes-container');
    if (!container) return;
    
    // *** THAY ĐỔI DUY NHẤT: Đổi <p> thành <div> để việc cuộn nội dung tốt hơn ***
    container.innerHTML = `<div class="themes-list"></div><div class="theme-content-display"><img src="" alt="Theme Illustration" id="theme-image"><div id="theme-details-text"></div></div>`;
        
    const list = container.querySelector('.themes-list');
    themesData.forEach((theme, i) => list.insertAdjacentHTML('beforeend', `<button class="theme-button" data-index="${i}"><i class="fas ${theme.icon}"></i><h4>${theme.title}</h4></button>`));

    const display = container.querySelector('.theme-content-display'), 
          imgEl = document.getElementById('theme-image'), 
          textEl = document.getElementById('theme-details-text'), // Vẫn lấy được element bình thường
          buttons = list.querySelectorAll('.theme-button');

    function updateThemeDisplay(index) {
        const theme = themesData[index];
        display.classList.add('is-changing');
        setTimeout(() => { 
            imgEl.src = theme.img; 
            textEl.textContent = theme.details; // Gán text vào div mới
            display.classList.remove('is-changing'); 
        }, 150);
        buttons.forEach(btn => btn.classList.remove('active'));
        buttons[index].classList.add('active');
    }
    list.addEventListener('click', e => { const btn = e.target.closest('.theme-button'); if (btn) updateThemeDisplay(btn.dataset.index); });
    updateThemeDisplay(0);
}
    
    // --- TIMELINE (UPDATED) ---
    function generateTimeline() {
        const timelineData = [
            { date: "01/07 - 22/07/2025", title: "Vòng Đăng ký", desc: "Mở cổng đăng ký trực tuyến, các đội nộp đề xuất ý tưởng và giải pháp." }, 
            { date: "23/07 - 31/07/2025", title: "Vòng Sơ Loại", desc: "BGK chấm điểm các đề xuất và công bố Top 20 đội xuất sắc nhất." }, 
            { date: "01/08 - 05/09/2025", title: "Phát Triển Sản Phẩm", desc: "Top 20 phát triển prototype với sự cố vấn 1:1 từ các mentor chuyên gia." }, 
            { date: "06/09/2025", title: "Vòng Bán Kết", desc: "Các đội nộp sản phẩm và thuyết trình để chọn ra Top 10 vào vòng Chung kết." }, 
            { date: "15/09/2025", title: "Coaching 1:1", desc: "Top 10 được huấn luyện chuyên sâu về kỹ năng trình bày và demo sản phẩm." }, 
            { date: "20/09/2025", title: "Chung Kết & Demo Day", desc: "Top 10 demo tại gian hàng, Top 5 pitching trên sân khấu chính để tìm ra Quán quân." }
        ];
        const wrapper = document.querySelector('.timeline-wrapper');
        if (!wrapper) return;
        wrapper.innerHTML = timelineData.map(item => `<div class="timeline-item animate-on-scroll"><div class="timeline-card"><div class="timeline-date">${item.date}</div><h4>${item.title}</h4><p>${item.desc}</p></div></div>`).join('');
        wrapper.insertAdjacentHTML('beforeend', '<div class="timeline-line-progress"></div>');
        wrapper.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    }
    function updateTimelineProgress() {
        const line = document.querySelector('.timeline-line-progress');
        const items = document.querySelectorAll('.timeline-item.is-visible');
        if (!line || items.length === 0) return;
        const lastVisibleItem = items[items.length - 1];
        const lastDotTop = lastVisibleItem.offsetTop + (lastVisibleItem.querySelector('.timeline-card').offsetTop) + 15;
        line.style.setProperty('--line-height', `${lastDotTop}px`);
    }

    // --- MENTORS SLIDER (UPDATED) ---
    function generateMentors() {
        const mentorsData = [
            { name: 'GS. TSKH. Hồ Tú Bảo', title: 'Giám đốc Khoa học, Viện John von Neumann (ĐHQG HCM)', img: './assets/images/mentors/profile.png' },
            { name: 'Chị Lê Mai Tuyết Trinh', title: 'Giám đốc VinRobotics (VinFast)', img: './assets/images/mentors/profile.png' },
            { name: 'Anh Pham Ngoc Nam', title: 'Phó Viện trưởng, Viện Kỹ thuật & KHTM, VinUniversity', img: './assets/images/mentors/profile.png' },
            { name: 'Cô Nguyễn Thị Phi Lê', title: 'Giám đốc, Trung tâm BK.AI (ĐH Bách Khoa HN)', img: './assets/images/mentors/profile.png' },
            { name: 'Chị Đỗ Minh Ngọc', title: 'Chủ tịch CLB VinTechTalent', img: './assets/images/mentors/profile.png' },
            { name: 'Anh Phan Lê', title: 'Giám đốc Tư vấn & Triển khai, VinBigdata', img: './assets/images/mentors/profile.png' },
            { name: 'Chị Trần Thu Huyền', title: 'Giám đốc chương trình, Quỹ VinIF', img: './assets/images/mentors/profile.png' },
            { name: 'Chị Lê Thái Hà', title: 'Giám đốc Điều hành, Quỹ VinFuture', img: './assets/images/mentors/profile.png' },
        ];
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (swiperWrapper) {
            swiperWrapper.innerHTML = mentorsData.map(mentor => `<div class="swiper-slide"><div class="mentor-card interactive-card"><div class="card-content"><img src="${mentor.img}" alt="${mentor.name}" class="animate-pop-in"><div class="mentor-info"><h4>${mentor.name}</h4><p>${mentor.title}</p></div></div></div></div>`).join('');
            new Swiper('.swiper', { loop: true, slidesPerView: 1, spaceBetween: 30, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
        }
    }

    // --- FAQ SECTION ---
    function generateFaq() {
        const faqData = [
            { question: "Em không có đội thì có tham gia được không?", answer: "Hoàn toàn được. Bạn có thể đăng ký với tư cách cá nhân. Ban tổ chức sẽ hỗ trợ ghép đội cho các thí sinh đăng ký cá nhân dựa trên kỹ năng và nguyện vọng của các bạn." },
            { question: "Cuộc thi có giới hạn về công nghệ sử dụng không?", answer: "Không. Chúng tôi khuyến khích sự sáng tạo. Bạn có thể sử dụng bất kỳ ngôn ngữ lập trình, nền tảng, hoặc framework nào mà bạn cho là phù hợp nhất để giải quyết vấn đề." },
            { question: "Sản phẩm của em có được bảo vệ quyền sở hữu trí tuệ không?", answer: "Có. Tất cả các sản phẩm dự thi đều thuộc quyền sở hữu trí tuệ của đội thi. Ban tổ chức cam kết không sử dụng sản phẩm cho mục đích thương mại nếu không có sự đồng ý của các bạn." },
            { question: "Ngoài giải thưởng tiền mặt, chúng em còn nhận được gì?", answer: "Các đội vào vòng Chung kết sẽ nhận được sự cố vấn 1-1 từ các chuyên gia hàng đầu, cơ hội thực tập và tuyển dụng tại Vingroup, cùng các khoản tín dụng (credits) từ các nền tảng cloud của nhà tài trợ." }
        ];
        const container = document.querySelector('.faq-container');
        if (!container) return;

        container.innerHTML = faqData.map(item => `
            <div class="faq-item">
                <button class="faq-question">${item.question}</button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        initFaqAccordion();
    }

    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- THREE.JS BACKGROUND ANIMATION ---
    function initThreeJS() {
        const heroCanvas = document.getElementById('hero-canvas');
        if (!heroCanvas || isTouchDevice || typeof THREE === 'undefined') {
            if(heroCanvas) heroCanvas.style.display = 'none';
            return;
        }
        let scene, camera, renderer, particles;
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        const style = getComputedStyle(document.documentElement);
        const color1 = new THREE.Color(style.getPropertyValue('--accent-start').trim());
        const color2 = new THREE.Color(style.getPropertyValue('--accent-end').trim());
        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 200;
            const particleCount = 150;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 800;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
                const color = color1.clone().lerp(color2, Math.random());
                colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
            }
            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const particleMaterial = new THREE.PointsMaterial({ size: 3, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, sizeAttenuation: true });
            particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);
            renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.addEventListener('mousemove', (e) => { mouseX = e.clientX - windowHalfX; mouseY = e.clientY - windowHalfY; });
            window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
        }
        function animate() {
            requestAnimationFrame(animate); render();
        }
        function render() {
            const time = Date.now() * 0.00005;
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            particles.rotation.y = time * 0.2;
            particles.rotation.x = time * 0.1;
            renderer.render(scene, camera);
        }
        init(); animate();
    }

    // --- INITIALIZE ALL DYNAMIC PARTS ---
    function initPage() {
        generateCountdown();
        generateThemes();
        generateTimeline();
        generateMentors();
        generateFaq();
        initThreeJS();
    }
    
    initPage();
});