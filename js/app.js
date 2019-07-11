const textArea=document.querySelector("#custom-text-area"),addTextButton=document.querySelector("#add-text-button"),restartButton=document.querySelector("#restart-button"),textContainer=document.querySelector("#text-container"),userInput=document.querySelector("#user-input"),stats=document.querySelector(".stats"),wpmUi=document.querySelector("#wpm"),cpmUi=document.querySelector("#cpm"),errorsUi=document.querySelector("#errors"),accuracyUi=document.querySelector("#accuracy"),unproductiveKeystrokesUi=document.querySelector("#unproductive-keystrokes"),elapsedTimeUi=document.querySelector("#elapsed-time"),fastestCharactersUi=document.querySelector("#fastest-characters"),slowestCharactersUi=document.querySelector("#slowest-characters"),leastAccurateCharactersUi=document.querySelector("#least-accurate-characters");let text="Welcome to the Typing Speed Test.\nTyping this short introduction text will assess your typing and provide you with statistics, including: typing speed in WPM (Words per Minute) and CPM (Characters per Minute), accuracy, unproductive keystrokes, fastest and slowest as well as the least accurate characters.\nYou can also double-click this box to set your own custom text for the test.\nHappy typing!",totalTyped=0,currentChar=0,correctChars=0,incorrectChars=0,errors=0,backspaces=0,charID=0,wpm=0,cpm=0,accuracy=0,unproductiveKeystrokes=0,startTimer=0,elapsedTime=0,charStart=0,charEnd=0,charSpeed={},charAccuracy={},charSpeedResults=[],charAccuracyResults=[],finished=!1;textArea.value=text;const startTest=e=>{finished||(0===currentChar&&(startTimer=(new Date).getTime()),userInput.value.length>text.length&&(userInput.value=userInput.value.slice(0,-1)),totalTyped++,trackCharAccuracyTotal(),e.target.value[currentChar]===text[currentChar]||"⏎"===getEl(currentChar).textContent&&null===e.target.value[currentChar]?(handleCorrectChars(),trackCharSpeed()):(handleIncorrectChars(),trackCharAccuracyWrong()),charStart=(new Date).getTime(),handleCurrentChar(),correctChars+incorrectChars===text.length&&finishedTyping())},getEl=e=>document.getElementById(e),handleCurrentChar=()=>{currentChar<text.length-1&&getEl(currentChar+1).classList.add("current"),userInput.value.length<text.length?currentChar++:currentChar=userInput.value.length},handleCorrectChars=()=>{getEl(currentChar).classList.add("correct"),getEl(currentChar).classList.remove("current"),getEl(currentChar).classList.contains("incorrect")&&getEl(currentChar).classList.contains("corrected")&&(getEl(currentChar).classList.add("was-incorrect"),getEl(currentChar).classList.remove("correct"),getEl(currentChar).classList.remove("corrected")),correctChars++},handleIncorrectChars=()=>{getEl(currentChar).classList.add("incorrect"),getEl(currentChar).classList.remove("current"),getEl(currentChar).classList.remove("corrected"),currentChar<userInput.value.length&&incorrectChars++},trackCharSpeed=()=>{currentChar>0&&(charEnd=(new Date).getTime()-charStart,charSpeed[text[currentChar]]?charSpeed[text[currentChar]].push(charEnd):charSpeed[text[currentChar]]=[charEnd])},trackCharAccuracyTotal=()=>{charAccuracy[text[currentChar]]?charAccuracy[text[currentChar]].total++:(charAccuracy[text[currentChar]]={},charAccuracy[text[currentChar]].total=1,charAccuracy[text[currentChar]].wrong=0,charAccuracy[text[currentChar]].accuracy=0)},trackCharAccuracyWrong=()=>{charAccuracy[text[currentChar]]?charAccuracy[text[currentChar]].wrong++:(charAccuracy[text[currentChar]]={},charAccuracy[text[currentChar]].total=1,charAccuracy[text[currentChar]].wrong=1,charAccuracy[text[currentChar]].accuracy=0)},finishedTyping=()=>{elapsedTime=(new Date).getTime()-startTimer,setTimeout(()=>{calculateScore(),displayScore(),restartButton.style.display="block",resetAll()},500),finished=!0},calculateScore=()=>{wpm=Math.round(text.length/5*(60/(elapsedTime/1e3))),cpm=Math.round(text.length*(60/(elapsedTime/1e3))),errors=incorrectChars+totalTyped-text.length,accuracy=(correctChars/text.length*100).toFixed(2),unproductiveKeystrokes=((incorrectChars+backspaces+totalTyped-text.length)/text.length*100).toFixed(2),calculateCharSpeed(),calculateCharAccuracy()},calculateCharSpeed=()=>{Object.keys(charSpeed).forEach(e=>{charSpeed[e]=Math.round(charSpeed[e].reduce((e,t)=>e+t,0)/charSpeed[e].length),charSpeedResults.push({char:e,speed:charSpeed[e]})}),charSpeedResults=charSpeedResults.sort((e,t)=>e.speed-t.speed)},calculateCharAccuracy=()=>{Object.keys(charAccuracy).forEach(e=>{charAccuracy[e].accuracy=Math.round(100-100*charAccuracy[e].wrong/charAccuracy[e].total),charAccuracyResults.push({char:e,accuracy:charAccuracy[e].accuracy,total:charAccuracy[e].total,wrong:charAccuracy[e].wrong})}),charAccuracyResults=charAccuracyResults.sort((e,t)=>e.accuracy-t.accuracy).filter(e=>(e.accuracy+="%",e.wrong>0))},displayScore=()=>{wpmUi.textContent=wpm,cpmUi.textContent=cpm,elapsedTimeUi.textContent=(elapsedTime/1e3).toFixed(1)+" seconds",errorsUi.textContent=errors,accuracyUi.textContent=accuracy,unproductiveKeystrokesUi.textContent=unproductiveKeystrokes,fastestCharactersUi.innerHTML=charSpeedResults.slice(0,5).map(function(e){return`<span>${" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char}</span>`}).join(""),slowestCharactersUi.innerHTML=charSpeedResults.slice(charSpeedResults.length-5,charSpeedResults.length).reverse().map(function(e){return`<span>${" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char}</span>`}).join(""),leastAccurateCharactersUi.innerHTML=charAccuracyResults.map(function(e){return`<span>${" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char}</span>`}).slice(0,5).join(""),showResults(),consoleLogResults()},consoleLogResults=()=>{console.log("Elapsed time: "+Math.round(elapsedTime/1e3)+" seconds"),console.log("Your speed is: "+wpm+" WPM"),console.log("CPM: "+cpm),console.log("Accuracy: "+accuracy+"%"),console.log("Total errors: "+errors),console.log("Unproductive keystrokes percentage: "+unproductiveKeystrokes+"%"),console.log("Text length: "+text.length),console.log("Total characters typed: "+(totalTyped+backspaces)),console.log("Correct characters: "+correctChars),console.log("Incorrect characters: "+incorrectChars),console.log("Backspaces: "+backspaces),console.log("Fastest characters: "),console.table(charSpeedResults.slice(0,10)),console.log("Slowest characters: "),console.table(charSpeedResults.slice(charSpeedResults.length-10,charSpeedResults.length).reverse()),console.log("Least accurate characters: "),console.table(charAccuracyResults)},resetResults=()=>{wpmUi.textContent=0,cpmUi.textContent=0,errorsUi.textContent=0,elapsedTimeUi.textContent=0,accuracyUi.textContent=0,unproductiveKeystrokesUi.textContent=0,fastestCharactersUi.textContent="",slowestCharactersUi.textContent="",leastAccurateCharactersUi.textContent=""},setText=()=>{textContainer.innerHTML="",finished=!1,setLines(text),resetAll(),userInput.focus()},setLines=e=>{let t=e.split("\n");t.length>1?t.forEach((e,r)=>{let c=document.createElement("div");c.setAttribute("class","line-"+r),setChars(e,c);let a=document.createElement("span");a.setAttribute("id",charID),a.textContent="⏎",r!==t.length-1&&c.appendChild(a),textContainer.appendChild(c),charID++}):setChars(e,textContainer)},setChars=(e,t)=>{e.split("").forEach(e=>{let r=document.createElement("span");r.setAttribute("id",charID);let c=document.createElement("i");c.textContent=" "," "===e?(r.innerHTML="&nbsp;",r.appendChild(c)):r.textContent=e,t.appendChild(r),charID++})},addCustomText=()=>{text=textArea.value.replace(/  +/g,""),textArea.value.length>0&&setText(),textArea.parentElement.style.display="none",restartButton.style.display="none",textContainer.style.display="block"},showAddCustomText=()=>{restart(),textContainer.style.display="none",textArea.parentElement.style.display="block",textArea.value=text,textArea.select()},hideAddCustomText=()=>{textArea.parentElement.style.display="none",userInput.focus()},showResults=()=>{stats.style.display="flex"},hideResults=()=>{stats.style.display="none"},restart=()=>{setText(),wpmUi.textContent=0,cpmUi.textContent=0,errorsUi.textContent=0,elapsedTimeUi.textContent=0,accuracyUi.textContent=0,unproductiveKeystrokesUi.textContent=0,fastestCharactersUi.textContent="",slowestCharactersUi.textContent="",leastAccurateCharactersUi.textContent="",stats.style.display="none",textArea.parentElement.style.display="none",restartButton.style.display="none"},resetAll=()=>{resetValues(),finished||getEl(currentChar).classList.add("current")},resetValues=()=>{elapsedTime=0,currentChar=0,correctChars=0,incorrectChars=0,charID=0,totalTyped=0,backspaces=0,errors=0,wpm=0,cpm=0,accuracy=0,unproductiveKeystrokes=0,charStart=0,charEnd=0,charSpeed={},charAccuracy={},charSpeedResults=[],charAccuracyResults=[],userInput.value="",textArea.value=""};userInput.addEventListener("input",startTest),userInput.addEventListener("keydown",e=>{"Backspace"===e.key&&(e.preventDefault(),handleBackspacedChars())});const handleBackspacedChars=()=>{currentChar>0&&backspaces++,currentChar>0&&currentChar--,userInput.value[currentChar]===text[currentChar]?correctChars>0&&correctChars--:(incorrectChars>0&&incorrectChars--,getEl(currentChar).classList.add("corrected")),getEl(currentChar).classList.add("current"),getEl(currentChar).classList.add("corrected"),currentChar<text.length-1&&getEl(currentChar+1).classList.remove("current"),getEl(currentChar).classList.remove("correct"),getEl(currentChar).classList.remove("was-incorrect"),userInput.value=userInput.value.slice(0,-1)};userInput.addEventListener("blur",()=>{textContainer.classList.remove("focused"),textContainer.classList.add("blurred")}),userInput.addEventListener("focus",()=>{textContainer.classList.remove("blurred"),textContainer.classList.add("focused")}),textContainer.addEventListener("dblclick",showAddCustomText),textContainer.addEventListener("click",hideAddCustomText),addTextButton.addEventListener("click",addCustomText),textArea.addEventListener("keydown",function(e){13!==e.keyCode||e.shiftKey||(e.preventDefault(),addCustomText())}),restartButton.addEventListener("click",restart),setText();