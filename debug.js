const deBugButton = document.getElementById('deBug');
        const popupWindow = document.getElementById('popupWindow');
        const sendButton = document.getElementById('sendButton');
        const closeButton = document.getElementById('closeButton');

        /**
         * 創建粒子效果，粒子根據動作（開啟或關閉）向內或向外移動
         * @param {HTMLElement} targetElement - 目標視窗元素
         * @param {boolean} isClosing - 是否為關閉動作
         */
        // function createParticles(targetElement, isClosing) {
        //     const targetRect = targetElement.getBoundingClientRect();

        //     // Check if the device is mobile
        //     const isMobile = window.innerWidth <= 768; // You can adjust the width threshold as needed
        //     const particleCount = isMobile ? 100 : 700; // Adjust particle count based on device

        //     const duration = 800; // 動畫持續時間（毫秒）

        //     for (let i = 0; i < particleCount; i++) {
        //         const particle = document.createElement('div');
        //         particle.className = 'particle';
        //         document.body.appendChild(particle);

        //         const size = Math.random() * 8 + 2;
        //         particle.style.width = `${size}px`;
        //         particle.style.height = `${size}px`;

        //         let startX, startY, endX, endY;

        //         if (isClosing) {
        //             // 關閉時：粒子從視窗周圍移動到隨機位置
        //             const borderPosition = Math.random();
        //             if (borderPosition < 0.25) {
        //                 // 上邊界
        //                 startX = targetRect.left + Math.random() * targetRect.width;
        //                 startY = targetRect.top;
        //             } else if (borderPosition < 0.5) {
        //                 // 右邊界
        //                 startX = targetRect.right - 10;
        //                 startY = targetRect.top + Math.random() * targetRect.height;
        //             } else if (borderPosition < 0.75) {
        //                 // 下邊界
        //                 startX = targetRect.left + Math.random() * targetRect.width;
        //                 startY = targetRect.bottom - 10;
        //             } else {
        //                 // 左邊界
        //                 startX = targetRect.left;
        //                 startY = targetRect.top + Math.random() * targetRect.height;
        //             }

        //             // 粒子移動到隨機位置
        //             endX = Math.random() * window.innerWidth;
        //             endY = Math.random() * window.innerHeight;
        //         } else {
        //             // 開啟時：粒子從螢幕邊緣移動到視窗周圍
        //             const edge = Math.floor(Math.random() * 4);
        //             switch(edge) {
        //                 case 0: // 上邊
        //                     startX = Math.random() * window.innerWidth;
        //                     startY = -10;
        //                     break;
        //                 case 1: // 右邊
        //                     startX = window.innerWidth + 10;
        //                     startY = Math.random() * window.innerHeight;
        //                     break;
        //                 case 2: // 下邊
        //                     startX = Math.random() * window.innerWidth;
        //                     startY = window.innerHeight + 10;
        //                     break;
        //                 case 3: // 左邊
        //                     startX = -10;
        //                     startY = Math.random() * window.innerHeight;
        //                     break;
        //             }

        //             // 粒子移動到視窗周圍的位置
        //             endX = targetRect.left + Math.random() * targetRect.width;
        //             endY = targetRect.top + Math.random() * targetRect.height;
        //         }

        //         // 設定粒子的起始位置
        //         particle.style.left = `${startX}px`;
        //         particle.style.top = `${startY}px`;

        //         // 使用 setTimeout 來觸發 CSS 轉換
        //         setTimeout(() => {
        //             particle.style.left = `${endX}px`;
        //             particle.style.top = `${endY}px`;
        //             particle.style.opacity = 0;
        //         }, 10); // 微小延遲以確保轉換生效

        //         // 動畫結束後移除粒子
        //         setTimeout(() => {
        //             if (particle.parentElement) {
        //                 document.body.removeChild(particle);
        //             }
        //         }, duration);
        //     }
        // }

        // 顯示視窗時觸發粒子匯聚效果並淡入
        deBugButton.addEventListener('click', () => {
            // createParticles(popupWindow, false); // 開啟時粒子匯聚
            // setTimeout(() => {  
                deBugButton.classList.add('hide'); // 隱藏按鈕
                popupWindow.classList.add('show'); // 顯示視窗
            // }, 400);
        });

        // 關閉視窗時使用粒子散開效果並淡出
        function closeWindow() {
            popupWindow.classList.remove('show'); // 淡出視窗
            deBugButton.classList.remove('hide'); // 顯示按鈕
            // createParticles(popupWindow, true); // 關閉時粒子散開
        }

        closeButton.addEventListener('click', () => {
            closeWindow();
        });

        // 當淡出動畫結束後，隱藏視窗
        popupWindow.addEventListener('transitionend', (event) => {
            if (!popupWindow.classList.contains('show')) {
                // 當 opacity 完全為 0 時，確保視窗不可見
                // 這裡不需要額外處理，因為 visibility 已在 CSS 控制
            }
        });

        sendButton.addEventListener('click', () => {
            showCustomAlert('Thanks for chipping in!');
            closeWindow(); // 發送後自動關閉視窗
        });
