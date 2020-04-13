// --------------------------------------------------------------
// A PARTIR DA BASE DE DADOS, MONTAR ELEMENTOS DA PÁGINA DE FEED:
// --------------------------------------------------------------

// Montar sequência de pius
montarPiusFeed();

function montarPiusFeed() {
    var piusArea = document.querySelector("#pius_area");

    if (piusArea != null) {
        var allPius = [];

        baseDeDados.data.forEach(function(userData){
            var userPius = userData.pius;

            userPius.forEach(function(piu){
                allPius.push(piu);
            });
        });

        sortPiusInTime(allPius);

        piusArea.innerHTML = "";

        allPius.forEach(function(piu){
            var piuElement = montarPiuElement(piu);

            piusArea.appendChild(piuElement);
        });

        // Adicionar functionalidades aos botãoes de ação dos pius:
        ativarFuncoesPius();
    }
}

function sortPiusInTime(pius){
    pius.sort(function(a, b){return getTimeFromPiuId(b.piuId) - getTimeFromPiuId(a.piuId)});
}

function getTimeFromPiuId(piuId){
    return piuId.split(":")[1];
}

function getUserNameFromPiuId(piuId){
    return piuId.split(":")[0];
}

function montarPiuElement(piu) {
    // Montar div externo ao piu:
    var piuElement = document.createElement("div");
    piuElement.classList.add("piu");
    piuElement.id = piu.piuId;

    var dadosUsuario = baseDeDados.getDadosUsuarioFromPiuId(piu.piuId);

    // Montar área principal do piu:
    var areaPrincipal = montarAreaPrincipal(piu, dadosUsuario);
    piuElement.appendChild(areaPrincipal);

    // Montar action buttons do piu:
    var actionButtons = montarPiuActionButtons(piu);
    piuElement.appendChild(actionButtons);

    return piuElement;
}

function montarAreaPrincipal(dadosPiu, dadosUsuario) {
    // Montar div da área principal do piu:
    var piuMainArea = document.createElement("div");
    piuMainArea.classList.add("piu_main_area");

    // Montar avatar do piu:
    var piuAvatar = document.createElement("img");
    piuAvatar.classList.add("avatar_piu");
    piuAvatar.alt = "Avatar usuário";
    piuAvatar.src = "../img/avatars/" + dadosUsuario.avatar;

    // Montar link do avatar e inserí-lo no piuReplyInfo:
    var piuAvatarLink = document.createElement("a");
    piuAvatarLink.href = "perfil.html?user=" + dadosUsuario.username;
    piuAvatarLink.appendChild(piuAvatar);
    piuMainArea.appendChild(piuAvatarLink);

    // Montar área de texto do piu:
    var piuTextArea = document.createElement("div");
    piuTextArea.classList.add("piu_text_area");

    // Montar informações do piu:
    var piuInfo = montarPiuInfo(dadosUsuario, dadosPiu);
    piuTextArea.appendChild(piuInfo);    

    // Montar mensagem do piu:
    var piuMessage = document.createElement("p");
    piuMessage.classList.add("piu_message");
    piuMessage.textContent = dadosPiu.message;
    piuTextArea.appendChild(piuMessage);

    // Caso exista, montar um piu_reply:
    if (dadosPiu.piuReplyId != null) {
        // Montar piu_reply:
        var piuReply = montarPiuReply(dadosPiu.piuReplyId);
        piuTextArea.appendChild(piuReply);
    }
    
    // Inserir piuTextArea em piuMainArea:
    piuMainArea.appendChild(piuTextArea); 

    return piuMainArea;
}

function montarPiuReply(replyPiuId) {
    var piuReply = document.createElement("div");
    piuReply.classList.add("piu_reply");

    // Definir dados do piu_reply: 
    var replyUserData = baseDeDados.getDadosUsuarioFromPiuId(replyPiuId);
    var replyPiuData = baseDeDados.getDadosPiuFromPiuId(replyPiuId);

    // Montar piuReplyInfo, porém sem avatar:
    var piuReplyInfo = montarPiuInfo(replyUserData, replyPiuData);

    // Montar avatar: 
    var piuReplyAvatar = document.createElement("img");
    piuReplyAvatar.classList.add("avatar_piu_reply");
    piuReplyAvatar.alt = "Avatar usuário reply";
    piuReplyAvatar.src = "../img/avatars/" + replyUserData.avatar;

    // Montar link do avatar e inserí-lo no piuReplyInfo:
    var piuReplyAvatarLink = document.createElement("a");
    piuReplyAvatarLink.href = "perfil.html?user=" + replyUserData.username;
    piuReplyAvatarLink.appendChild(piuReplyAvatar);
    piuReplyInfo.insertBefore(piuReplyAvatarLink, piuReplyInfo.childNodes[0]);

    // Adicionar piuReplyInfo em piuReply:
    piuReply.appendChild(piuReplyInfo);

    // Montar div da mensagem do piu_reply:
    var piuReplyTextArea = document.createElement("div");
    piuReplyTextArea.classList.add("piu_text_area");
    piuReplyTextArea.classList.add("piu_reply_text_area");

    // Montar mensagem do piu_reply:
    var piuReplyMessage = document.createElement("p");
    piuReplyMessage.classList.add("piu_message");
    piuReplyMessage.textContent = replyPiuData.message;
    piuReplyTextArea.appendChild(piuReplyMessage);

    // Adicionar piuReplyTextArea em piuReply:
    piuReply.appendChild(piuReplyTextArea);

    return piuReply;
}

function getRelativeTime(timeInMilliseconds) {
    var relativeTime = "";

    var currentTime = Date.parse(new Date());

    var differenceInSeconds = (currentTime - timeInMilliseconds)/1000;

    if (differenceInSeconds < 60) {
        relativeTime = differenceInSeconds.toFixed(0) + " s";
    } else if (differenceInSeconds < 3600) {
        relativeTime = (differenceInSeconds/60).toFixed(0) + " min";
    } else if (differenceInSeconds < 3600*24) {
        relativeTime = (differenceInSeconds/3600).toFixed(0) + " h";
    } else {
        relativeTime = (differenceInSeconds/3600/24).toFixed(0) + " dia";
        if ((differenceInSeconds/3600/24).toFixed(0) > 1) relativeTime = relativeTime + "s";
    }

    return relativeTime;
}

function montarPiuInfo(dadosUsuario, dadosPiu) {
    var piuInfo = document.createElement("p");
    piuInfo.classList.add("piu_info");

    // Montar nome no piuInfo:
    var piuName = document.createElement("a");
    piuName.href = "perfil.html?user=" + dadosUsuario.username;
    piuName.classList.add("piuwer_name");
    piuName.textContent = dadosUsuario.nome;
    piuInfo.appendChild(piuName);

    // Montar username no piuInfo:
    var piuUserName = document.createElement("a");
    piuUserName.href = "perfil.html?user=" + dadosUsuario.username;
    piuUserName.classList.add("piuwer_username");
    piuUserName.textContent = "@" + dadosUsuario.username;
    piuInfo.appendChild(piuUserName);

    // Montar ponto no piuInfo:
    var piuPonto = document.createElement("span");
    piuPonto.classList.add("ponto");
    piuPonto.classList.add("ponto_piu");
    piuInfo.appendChild(piuPonto);

    // Montar tempo no piuInfo:
    var piuTime = document.createElement("span");
    piuTime.classList.add("piu_time");
    piuTime.textContent = getRelativeTime(getTimeFromPiuId(dadosPiu.piuId));
    piuInfo.appendChild(piuTime);    

    return piuInfo;
}

function montarPiuActionButtons(piu) {
    var piuActionsArea = document.createElement("div");
    piuActionsArea.classList.add("piu_actions_area");

    // Montar ação de amar:
    var amarBox = createActionElement("amar_button", "Amar", "Amar.svg", piu.getLikes());
    piuActionsArea.appendChild(amarBox);

    // Montar ação de retornar:
    var retornarBox = createActionElement("reply_button", "Retornar", "Retornar.svg", piu.getReplies());
    piuActionsArea.appendChild(retornarBox);

    // Montar ação de destacar:
    var destacarBox = createActionElement("highlight_button", "Destacar", "Alfinete.svg");
    piuActionsArea.appendChild(destacarBox);
    
    return piuActionsArea;
}

function createActionElement(iconClass, iconAlt, iconSrc, actionCountNumber) {
    var actionBox = document.createElement("div");
    actionBox.classList.add("action_box");

    var amarIcon = createImgElement(["piu_action_icon", iconClass], iconAlt, "../img/icons/" + iconSrc);
    actionBox.appendChild(amarIcon);

    if (actionCountNumber != null) {
        var actionCount = document.createElement("p");
        actionCount.classList.add("action_count");
        actionCount.textContent = actionCountNumber;
        actionBox.appendChild(actionCount);
    }

    return actionBox;
}

function createImgElement(classList, alt, src) {
    var img = document.createElement("img");
    classList.forEach(function(classItem){
        img.classList.add(classItem);
    });
    img.alt = alt;
    img.src = src;
    return img;
}