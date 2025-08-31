const faqs = {
  "shipping": "Yes — all orders ship in plain, unmarked packaging. 100% private.",
  "discreet": "All orders are shipped discreetly with no logos or labels.",
  "free shipping": "We offer free shipping on orders over $50 (US) and £40 (UK).",
  "return": "Due to the intimate nature of our products, most sales are final. Faulty items will be replaced or refunded.",
  "privacy": "We respect your privacy. See our Privacy Policies (US & UK) for details.",
  "gdpr": "We comply with GDPR. You may request access, correction, or deletion of your data anytime.",
  "2257": "All models appearing on this website were 18+ at the time of photography. Records are maintained as required by 18 U.S.C. §2257."
};

function toggleChat(){
  const box = document.getElementById('chat-box');
  box.style.display = (box.style.display==='block') ? 'none' : 'block';
  if(box.style.display==='block'){
    trackEvent('chat_open','Chatbox opened');
  }
}

function handleChat(){
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if(!msg) return false;
  const messages = document.getElementById('chat-messages');
  const userDiv = document.createElement('div');
  userDiv.className='user-msg';
  userDiv.textContent=msg;
  messages.appendChild(userDiv);

  // find response
  let response = null;
  const lower = msg.toLowerCase();
  for(const key in faqs){
    if(lower.includes(key)){
      response = faqs[key];
      break;
    }
  }
  if(!response){
    response = "I’m not sure about that. 👉 <a href='contact.html' style='color:#7c0e0c;'>Chat with a real person</a>";
  }
  const botDiv=document.createElement('div');
  botDiv.className='bot-msg';
  botDiv.innerHTML=response;
  messages.appendChild(botDiv);
  messages.scrollTop=messages.scrollHeight;

  input.value='';
  return false;
}
