(async function () {
  // Specifies style options to customize the Web Chat canvas.
  // Please visit https://microsoft.github.io/BotFramework-WebChat for customization samples.
  const styleOptions = {
    // Hide upload button.
    hideUploadButton: false,
    autoScrollSnapOnPage: true,
    botAvatarBackgroundColor: '#00000000',
    botAvatarImage: 'https://byu-pathway.brightspotcdn.com/42/2e/4d4c7b10498c84233ae51179437c/byu-pw-icon-gold-rgb-1-1.svg',
    botAvatarInitials: '',
    backgroundColor: '#00000000',
    bubbleBackground: '#00000000',
    bubbleTextColor: '#000000',
    bubbleBorderRadius: 10,
    bubbleFromUserBackground: '#00000000',
    bubbleFromUserBorderRadius: 10,
    bubbleFromUserTextColor: '#000000',
    rootHeight: '100%',
    rootWidth: '100%',
    transitionDuration: '.5s',
    sendBoxBackground: '#00000',
    sendBoxTextColor: '#000000',
    sendBoxBorderBottom: 'solid 1px #E6E6E6',
    sendBoxBorderLeft: 'solid 1px #E6E6E6',
    sendBoxBorderRight: 'solid 1px #E6E6E6',
    sendBoxBorderTop: 'solid 1px #E6E6E6',
  };

  // Specifies the token endpoint URL.
  // To get this value, visit Copilot Studio > Settings > Channels > Mobile app page.
  const tokenEndpointURL = new URL('https://20a2c64a8afc44f894889f612ed708.ee.environment.api.powerplatform.com/powervirtualagents/botsbyschema/craab_bot1/directline/token?api-version=2022-03-01-preview');

  // Specifies the language the copilot and Web Chat should display in:
  // - (Recommended) To match the page language, set it to document.documentElement.lang
  // - To use current user language, set it to navigator.language with a fallback language
  // - To use another language, set it to supported Unicode locale

  // Setting page language is highly recommended.
  // When page language is set, browsers will use native font for the respective language.

  const locale = document.documentElement.lang || 'en'; // Uses language specified in <html> element and fallback to English (United States).
  // const locale = navigator.language || 'ja-JP'; // Uses user preferred language and fallback to Japanese.
  // const locale = 'zh-HAnt'; // Always use Chinese (Traditional).

  const apiVersion = tokenEndpointURL.searchParams.get('api-version');

  const [directLineURL, token] = await Promise.all([
    fetch(new URL(`/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`, tokenEndpointURL))
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to retrieve regional channel settings.');
        }

        return response.json();
      })
      .then(({ channelUrlsById: { directline } }) => directline),
    fetch(tokenEndpointURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to retrieve Direct Line token.');
        }

        return response.json();
      })
      .then(({ token }) => token)
  ]);

  // The "token" variable is the credentials for accessing the current conversation.
  // To maintain conversation across page navigation, save and reuse the token.

  // The token could have access to sensitive information about the user.
  // It must be treated like user password.

  const directLine = WebChat.createDirectLine({ domain: new URL('v3/directline', directLineURL), token });

  // Sends "startConversation" event when the connection is established.

  const subscription = directLine.connectionStatus$.subscribe({
    next(value) {
      if (value === 2) {
        directLine
          .postActivity({
            localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale,
            name: 'startConversation',
            type: 'event'
          })
          .subscribe();

        // Only send the event once, unsubscribe after the event is sent.
        subscription.unsubscribe();
      }
    }
  });

  WebChat.renderWebChat({ directLine, locale, styleOptions }, document.getElementById('webchatcanvas'));
  document.querySelector('.webchat__send-box .webchat__send-box__main').style.display = "none";
})();


// EVENT LISTENER TO CHECK FOR USER TO CLICK LOG IN
document.addEventListener('DOMContentLoaded', function () {
  // Function to log the latest node with the desired content
  function logLatestNode(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const latestNode = mutation.target.lastElementChild;
        if (latestNode && containsDesiredContent(latestNode)) {
          const loginButton = latestNode.querySelector('button');
          if (loginButton.getAttribute('title') === 'Log in') {
            loginButton.addEventListener('click', () => {
              document.querySelector('.webchat__send-box .webchat__send-box__main').style.display = "flex";
          })
          }
          
        }
      }
    }
  }

  // Options for the Mutation Observer
  const options = {
    childList: true,
    subtree: true,
  };

  // Create a Mutation Observer
  const observer = new MutationObserver(logLatestNode);

  // Target the div with the id "webchatcanvas"
  const webchatcanvasElement = document.getElementById('webchatcanvas');

  // Observe changes in the div
  observer.observe(webchatcanvasElement, options);

  // Helper function to check if a node contains the desired content
  function containsDesiredContent(node) {
    const pElement = node.querySelector('button div');
    return pElement && pElement.textContent.trim() === 'Log in';
  }
});


// EVENT LISTENER TO CHECK FOR USER INPUT
document.addEventListener('DOMContentLoaded', function () {
  // Function to log the latest node with the desired content
  function logLatestNode(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const latestNode = mutation.target.lastElementChild;
        if (latestNode && containsDesiredContent(latestNode) && latestNode.parentNode.tagName !== 'DIV') {
          document.querySelector('.webchat__send-box .webchat__send-box__main').style.display = "none";
        }
      }
    }
  }

  // Options for the Mutation Observer
  const options = {
    childList: true,
    subtree: true,
  };

  // Create a Mutation Observer
  const observer = new MutationObserver(logLatestNode);

  // Target the div with the id "webchatcanvas"
  const webchatcanvasElement = document.getElementById('webchatcanvas');

  // Observe changes in the div
  observer.observe(webchatcanvasElement, options);

  // Helper function to check if a node contains the desired content
  function containsDesiredContent(node) {
    const pElement = node.querySelector('.webchat__basic-transcript__activity .webchat__bubble--from-user .webchat__bubble__content');
    return pElement;
  }
});


// EVENT LISTENER TO CHECK FOR OTHER TYPING INSTANCES
document.addEventListener('DOMContentLoaded', function () {
  // Function to log the latest node with the desired content
  function logLatestNode(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const latestNode = mutation.target.lastElementChild;
        if (latestNode && containsDesiredContent(latestNode)) {
          document.querySelector('.webchat__send-box .webchat__send-box__main').style.display = "flex";
        }
      }
    }
  }

  // Options for the Mutation Observer
  const options = {
    childList: true,
    subtree: true,
  };

  // Create a Mutation Observer
  const observer = new MutationObserver(logLatestNode);

  // Target the div with the id "webchatcanvas"
  const webchatcanvasElement = document.getElementById('webchatcanvas');

  // Observe changes in the div
  observer.observe(webchatcanvasElement, options);

  // Helper function to check if a node contains the desired content
  function containsDesiredContent(node) {
    const pElement = node.querySelector('.webchat__basic-transcript__activity-body .webchat__stacked-layout__content .webchat__stacked-layout__message-row .webchat__stacked-layout__message .webchat__bubble__content div p');
    return pElement && (pElement.textContent.trim().startsWith('Please tell us why') || pElement.textContent.trim().startsWith('Please type your') || pElement.textContent.trim().startsWith('If I may assist you') || pElement.textContent.trim().startsWith('Type your question') || pElement.textContent.trim().startsWith('Type a detailed description') || pElement.textContent.trim().startsWith('Please type your comments') || pElement.textContent.trim().startsWith('Please explain in detail why') || pElement.textContent.trim().startsWith('What school is') || pElement.textContent.trim().startsWith('Please use the') || pElement.textContent.trim().startsWith('Please enter your') || pElement.textContent.trim().startsWith("I’m sorry, I’m not sure") || pElement.textContent.trim().startsWith("Wonderful! Use the space below"));
  }
});


  // Open and close menu button in header
  
  document.addEventListener('DOMContentLoaded', function() {
    const menuCheckbox = document.getElementById('menu-checkbox');
    const menuOptions = document.querySelector('.sidebar');

    menuCheckbox.addEventListener('change', function() {
        if (menuCheckbox.checked) {
            menuOptions.classList.add('create');
            setTimeout(function() {
                menuOptions.classList.add('active');
            }, 50); // Retraso para asegurar la transición
        } else {
            menuOptions.classList.remove('active');
            setTimeout(function() {
                menuOptions.classList.remove('create');
            }, 300); // Retraso para asegurar la transición
        }
    });
});

/*   document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-btn');
    const menuOptions = document.querySelector('.sidebar');
    const closeButton = document.querySelector('.menu-btn');
  
    menuButton.addEventListener('click', function() {
      menuOptions.classList.toggle('active');
    });
  
    closeButton.addEventListener('click', function() {
      menuOptions.classList.remove('active');
    });
  }); */
