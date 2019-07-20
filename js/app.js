"use strict";var textArea=document.querySelector("#custom-text-area"),addTextButton=document.querySelector("#add-text-button"),restartButton=document.querySelector("#restart-button"),textContainer=document.querySelector("#text-container"),userInput=document.querySelector("#user-input"),stats=document.querySelector(".stats"),wpmUi=document.querySelector("#wpm"),cpmUi=document.querySelector("#cpm"),errorsUi=document.querySelector("#errors"),accuracyUi=document.querySelector("#accuracy"),unproductiveKeystrokesUi=document.querySelector("#unproductive-keystrokes"),elapsedTimeUi=document.querySelector("#elapsed-time"),fastestCharactersUi=document.querySelector("#fastest-characters"),slowestCharactersUi=document.querySelector("#slowest-characters"),leastAccurateCharactersUi=document.querySelector("#least-accurate-characters"),text="Welcome to the Typing Speed Test.\nTyping this short introduction text will assess your typing and provide you with statistics, including: typing speed in WPM (Words per Minute) and CPM (Characters per Minute), accuracy, unproductive keystrokes, fastest and slowest as well as the least accurate characters.\nYou can also double-click this box to set your own custom text for the test.\nHappy typing!";text="Pack my box with five dozen liquor jugs.";var totalTyped=0,currentChar=0,correctChars=0,incorrectChars=0,errors=0,backspaces=0,charID=0,wpm=0,cpm=0,accuracy=0,unproductiveKeystrokes=0,startTimer=0,elapsedTime=0,charStart=0,charEnd=0,charSpeed={},charAccuracy={},charSpeedResults=[],charAccuracyResults=[],finished=!1;textArea.value=text;var startTest=function(e){finished||(0===currentChar&&(startTimer=(new Date).getTime()),userInput.value.length>text.length&&(userInput.value=userInput.value.slice(0,-1)),totalTyped++,trackCharAccuracyTotal(),e.target.value[currentChar]===text[currentChar]||"⏎"===getEl(currentChar).textContent&&null===e.target.value[currentChar]?(handleCorrectChars(),trackCharSpeed()):(handleIncorrectChars(),trackCharAccuracyWrong()),handleCurrentChar(),correctChars+incorrectChars===text.length&&finishedTyping())},getEl=function(e){return document.getElementById(e)},handleCurrentChar=function(){charStart=(new Date).getTime(),currentChar<text.length-1&&getEl(currentChar+1).classList.add("current"),userInput.value.length<text.length?currentChar++:currentChar=userInput.value.length},handleCorrectChars=function(){getEl(currentChar).classList.add("correct"),getEl(currentChar).classList.remove("current"),getEl(currentChar).classList.contains("incorrect")&&getEl(currentChar).classList.contains("corrected")&&(getEl(currentChar).classList.add("was-incorrect"),getEl(currentChar).classList.remove("correct"),getEl(currentChar).classList.remove("corrected")),correctChars++},handleIncorrectChars=function(){getEl(currentChar).classList.add("incorrect"),getEl(currentChar).classList.remove("current"),getEl(currentChar).classList.remove("corrected"),currentChar<userInput.value.length&&incorrectChars++},trackCharSpeed=function(){currentChar>0&&(charEnd=(new Date).getTime()-charStart,charSpeed[text[currentChar]]?charSpeed[text[currentChar]].push(charEnd):charSpeed[text[currentChar]]=[charEnd])},trackCharAccuracyTotal=function(){charAccuracy[text[currentChar]]?charAccuracy[text[currentChar]].total++:(charAccuracy[text[currentChar]]={},charAccuracy[text[currentChar]].total=1,charAccuracy[text[currentChar]].wrong=0,charAccuracy[text[currentChar]].accuracy=0)},trackCharAccuracyWrong=function(){charAccuracy[text[currentChar]]?charAccuracy[text[currentChar]].wrong++:(charAccuracy[text[currentChar]]={},charAccuracy[text[currentChar]].total=1,charAccuracy[text[currentChar]].wrong=1,charAccuracy[text[currentChar]].accuracy=0)},finishedTyping=function(){elapsedTime=(new Date).getTime()-startTimer,setTimeout(function(){calculateScore(),displayScore(),resetAll()},500),finished=!0},calculateScore=function(){wpm=Math.round(text.length/5*(60/(elapsedTime/1e3))),cpm=Math.round(text.length*(60/(elapsedTime/1e3))),errors=incorrectChars+totalTyped-text.length,accuracy=(correctChars/text.length*100).toFixed(2),unproductiveKeystrokes=((incorrectChars+backspaces+totalTyped-text.length)/text.length*100).toFixed(2),calculateCharSpeed(),calculateCharAccuracy()},calculateCharSpeed=function(){Object.keys(charSpeed).forEach(function(e){charSpeed[e]=Math.round(charSpeed[e].reduce(function(e,t){return e+t},0)/charSpeed[e].length),charSpeedResults.push({char:e,speed:charSpeed[e]})}),charSpeedResults=charSpeedResults.sort(function(e,t){return e.speed-t.speed})},calculateCharAccuracy=function(){Object.keys(charAccuracy).forEach(function(e){charAccuracy[e].accuracy=Math.round(100-100*charAccuracy[e].wrong/charAccuracy[e].total),charAccuracyResults.push({char:e,accuracy:charAccuracy[e].accuracy,total:charAccuracy[e].total,wrong:charAccuracy[e].wrong})}),charAccuracyResults=charAccuracyResults.sort(function(e,t){return e.accuracy-t.accuracy}).filter(function(e){return e.accuracy+="%",e.wrong>0})},displayScore=function(){wpmUi.textContent=wpm,cpmUi.textContent=cpm,elapsedTimeUi.textContent=(elapsedTime/1e3).toFixed(1)+" seconds",errorsUi.textContent=errors,accuracyUi.textContent=accuracy,unproductiveKeystrokesUi.textContent=unproductiveKeystrokes,fastestCharactersUi.innerHTML=charSpeedResults.slice(0,5).map(function(e){return"<span>".concat(" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char,"</span>")}).join(""),slowestCharactersUi.innerHTML=charSpeedResults.slice(charSpeedResults.length-5,charSpeedResults.length).reverse().map(function(e){return"<span>".concat(" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char,"</span>")}).join(""),leastAccurateCharactersUi.innerHTML=charAccuracyResults.map(function(e){return"<span>".concat(" "===e.char?"SPACE":"\n"===e.char?"ENTER":e.char,"</span>")}).slice(0,5).join(""),showResults()},resetResults=function(){wpmUi.textContent=0,cpmUi.textContent=0,errorsUi.textContent=0,elapsedTimeUi.textContent=0,accuracyUi.textContent=0,unproductiveKeystrokesUi.textContent=0,fastestCharactersUi.textContent="",slowestCharactersUi.textContent="",leastAccurateCharactersUi.textContent=""},setText=function(){textContainer.innerHTML="",finished=!1,setLines(text),resetAll(),userInput.focus()},setLines=function(e){var t=e.split("\n");t.length>1?t.forEach(function(e,r){var c=document.createElement("div");c.setAttribute("class","line-"+r),setChars(e,c);var a=document.createElement("span");a.setAttribute("id",charID),a.textContent="⏎",r!==t.length-1&&c.appendChild(a),textContainer.appendChild(c),charID++}):setChars(e,textContainer)},setChars=function(e,t){e.split("").forEach(function(e){var r=document.createElement("span");r.setAttribute("id",charID);var c=document.createElement("i");c.textContent=" "," "===e?(r.innerHTML="&nbsp;",r.appendChild(c)):r.textContent=e,t.appendChild(r),charID++})},addCustomText=function(){text=textArea.value.replace(/  +/g,""),textArea.value.length>0&&setText(),hideAddCustomText()},showAddCustomText=function(){restart(),textContainer.style.display="none",textArea.parentElement.style.display="block",textArea.value=text,textArea.select()},hideAddCustomText=function(){textArea.parentElement.style.display="none",textContainer.style.display="block",userInput.focus()},showResults=function(){stats.style.display="flex",restartButton.style.display="block"},hideResults=function(){stats.style.display="none",restartButton.style.display="none"},restart=function(){setText(),resetResults(),hideResults(),textArea.parentElement.style.display="none"},resetAll=function(){elapsedTime=0,currentChar=0,correctChars=0,incorrectChars=0,charID=0,totalTyped=0,backspaces=0,errors=0,wpm=0,cpm=0,accuracy=0,unproductiveKeystrokes=0,charStart=0,charEnd=0,charSpeed={},charAccuracy={},charSpeedResults=[],charAccuracyResults=[],userInput.value="",textArea.value="",finished||getEl(currentChar).classList.add("current")};userInput.addEventListener("input",startTest),userInput.addEventListener("keydown",function(e){"Backspace"===e.key&&(e.preventDefault(),handleBackspacedChars())});var handleBackspacedChars=function(){currentChar>0&&(backspaces++,currentChar--),userInput.value[currentChar]===text[currentChar]?correctChars>0&&correctChars--:(incorrectChars>0&&incorrectChars--,getEl(currentChar).classList.add("corrected")),getEl(currentChar).classList.add("current"),getEl(currentChar).classList.add("corrected"),currentChar<text.length-1&&getEl(currentChar+1).classList.remove("current"),getEl(currentChar).classList.remove("correct"),getEl(currentChar).classList.remove("was-incorrect"),userInput.value=userInput.value.slice(0,-1)};userInput.addEventListener("blur",function(){textContainer.classList.remove("focused"),textContainer.classList.add("blurred")}),userInput.addEventListener("focus",function(){textContainer.classList.remove("blurred"),textContainer.classList.add("focused")}),textContainer.addEventListener("dblclick",showAddCustomText),textContainer.addEventListener("click",hideAddCustomText),addTextButton.addEventListener("click",addCustomText),textArea.addEventListener("keydown",function(e){13!==e.keyCode||e.shiftKey||(e.preventDefault(),addCustomText())}),restartButton.addEventListener("click",restart),setText();