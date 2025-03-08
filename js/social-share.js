// 社交媒体分享按钮
(function() {
  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 只在文章页面添加分享按钮
    if (!document.querySelector('.post-content')) {
      return;
    }

    // 创建分享按钮容器
    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-share-container';
    
    // 获取当前页面信息
    const pageTitle = document.title;
    const pageUrl = encodeURIComponent(window.location.href);
    const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
    const pageImage = document.querySelector('meta[property="og:image"]')?.content || '';
    
    // 定义要添加的社交媒体平台（只保留微信、推特、QQ和复制链接）
    const platforms = [
      {
        name: '微信',
        icon: 'iconfont icon-wechat-fill',
        action: function() {
          // 创建二维码弹窗
          const qrcodeContainer = document.createElement('div');
          qrcodeContainer.className = 'qrcode-popup';
          
          // 生成唯一ID避免冲突
          const qrcodeId = 'qrcode-' + Date.now();
          
          qrcodeContainer.innerHTML = `
            <div class="qrcode-content">
              <h4>微信扫一扫分享</h4>
              <div id="${qrcodeId}" class="qrcode-box"></div>
              <p>打开微信，点击发现，使用扫一扫即可将网页分享至朋友圈。</p>
              <button class="close-btn">关闭</button>
            </div>
          `;
          document.body.appendChild(qrcodeContainer);
          
          // 使用第三方库生成二维码（需要引入qrcode.js）
          if (typeof QRCode !== 'undefined') {
            // 使用更高质量的二维码设置
            new QRCode(document.getElementById(qrcodeId), {
              text: window.location.href,
              width: 220,  // 增加尺寸提高清晰度
              height: 220, // 增加尺寸提高清晰度
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H, // 使用最高纠错级别
              margin: 10 // 增加边距使扫描更容易
            });
            
            // 添加调试信息
            console.log("生成二维码内容:", window.location.href);
          } else {
            document.getElementById(qrcodeId).innerHTML = '请引入QRCode库';
            console.error("QRCode 库未加载");
          }
          
          // 关闭按钮事件
          qrcodeContainer.querySelector('.close-btn').addEventListener('click', function() {
            document.body.removeChild(qrcodeContainer);
          });
          
          // 点击背景也可以关闭弹窗
          qrcodeContainer.addEventListener('click', function(e) {
            if (e.target === qrcodeContainer) {
              document.body.removeChild(qrcodeContainer);
            }
          });
          
          // ESC键关闭弹窗
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.contains(qrcodeContainer)) {
              document.body.removeChild(qrcodeContainer);
            }
          });
        }
      },
      {
        name: 'QQ',
        icon: 'iconfont icon-qq-fill',
        url: `https://connect.qq.com/widget/shareqq/index.html?url=${pageUrl}&title=${encodeURIComponent(pageTitle)}&source=${encodeURIComponent(pageDescription)}&pics=${encodeURIComponent(pageImage)}`
      },
      {
        name: '推特',
        icon: 'iconfont icon-twitter-fill',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${pageUrl}`
      },
    //   {
    //     name: '微信小程序',
    //     icon: 'iconfont icon-mini-program-fill',
    //     url: `https://wechat.com/miniprogram/share?url=${pageUrl}&title=${encodeURIComponent(pageTitle)}`
    //   },
      {
        name: '链接',
        icon: 'iconfont icon-mini-program-fill',
        action: function() {
          // 创建临时输入框
          const tempInput = document.createElement('input');
          tempInput.value = window.location.href;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          
          // 显示复制成功提示
          const toast = document.createElement('div');
          toast.className = 'copy-toast';
          toast.textContent = '链接已复制到剪贴板';
          document.body.appendChild(toast);
          
          // 2秒后移除提示
          setTimeout(function() {
            document.body.removeChild(toast);
          }, 2000);
        }
      }
    ];
    
    // 创建标题
    const shareTitle = document.createElement('div');
    shareTitle.className = 'share-title';
    shareTitle.innerHTML = '<i class="iconfont icon-share"></i> 分享到：';
    shareContainer.appendChild(shareTitle);
    
    // 创建按钮组
    const shareButtons = document.createElement('div');
    shareButtons.className = 'share-buttons';
    
    // 添加各平台按钮
    platforms.forEach(function(platform) {
      const btn = document.createElement('div');
      btn.className = 'share-btn';
      btn.setAttribute('data-platform', platform.name);
      
      if (platform.url) {
        btn.innerHTML = `<a href="${platform.url}" target="_blank" rel="noopener noreferrer"><i class="${platform.icon}"></i></a>`;
      } else {
        btn.innerHTML = `<i class="${platform.icon}"></i>`;
        btn.addEventListener('click', platform.action);
      }
      
      // 添加提示文字
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = platform.name;
      btn.appendChild(tooltip);
      
      shareButtons.appendChild(btn);
    });
    
    shareContainer.appendChild(shareButtons);
    
    // 将分享按钮添加到许可协议右下角
    const licenseBox = document.querySelector('.license-box');
    if (licenseBox) {
      // 设置容器样式为绝对定位
      shareContainer.style.position = 'absolute';
      shareContainer.style.right = '10px';
      shareContainer.style.bottom = '10px';
      shareContainer.style.margin = '0';
      shareContainer.style.padding = '0';
      shareContainer.style.border = 'none';
      
      // 调整许可证框的样式以容纳分享按钮
      licenseBox.style.position = 'relative';
      licenseBox.style.paddingBottom = '50px';
      
      // 添加到许可证框中
      licenseBox.appendChild(shareContainer);
    } else {
      // 如果找不到许可证框，则添加到文章底部
      const postContent = document.querySelector('.post-content');
      if (postContent) {
        postContent.appendChild(shareContainer);
      }
    }
  });
})();