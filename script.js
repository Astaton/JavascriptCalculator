//jshint esnext:true
$(document).ready(function() {
  var firstLineArr = [];
  var secondLineArr = [];
  var secondLineArrBackUp = [];
  var numArr = [];
  var opArr = [];
  var operand = true;
  var  equalsBool = false;
  var limit = false;
  
  //round10 start
  (function() {
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }

})(); //round10 stop
  
  function opSearch(arr, direction){
    if(direction<0){
      i=arr.length-1;
    //not sure if "-" should be one of the or conditions
    while((!isNaN(arr[i]) || arr[i] === "." || arr[i] === "-")&& i>0 ){i--;}
     return i;} 
      else{ i=0;
    while((!isNaN(arr[i]) || arr[i] === "." || arr[i] === "-")&& i<=arr.length ){i++;}
      return i;}
  }
  
  function clearOperand(arr){
    arr.splice(arr.length-1, 1);
    return arr;
  }
  
  function updateScreenRow1 (key){
    if (key === undefined || limit){
      $("#screenRow1").replaceWith('<p id="screenRow1">00000000000</p>');
      return;
    }
    if(key === "&radic;"){
      if(firstLineArr.length === 0){return};
      firstLineArr.unshift("&radic;");
      $("#screenRow1").replaceWith('<p id="screenRow1">'+firstLineArr.join('')+'</p>');
      return;
    }
    if(key === "neg"){
      if(firstLineArr.length === 0){return};
      console.log(firstLineArr);
      if(!firstLineArr[0]<0){firstLineArr.unshift("-");}
       $("#screenRow1").replaceWith('<p id="screenRow1">'+firstLineArr.join('')+'</p>');
      return;
    }
    if(key === "pos"){
      if(firstLineArr.length === 0){return};
       $("#screenRow1").replaceWith('<p id="screenRow1">'+firstLineArr.join('')+'</p>');
      return;
    }
    if(key === "zero"){
      $("#screenRow1").replaceWith('<p id="screenRow1">0</p>');
      return;
    }
    if(key === "result"){
      if(numArr.length>10){
      $("#screenRow1").replaceWith('<p id="screenRow1">'+"Screen limit"+'</p>');
      return;        
      }else{
        firstLineArr = numArr;
      $("#screenRow1").replaceWith('<p id="screenRow1">'+numArr.join('')+'</p>');
      return;
      }
    }
    //else{
      if(firstLineArr.length>=10){
        limit = true;
        $("#screenRow2").replaceWith('<p id="screenRow2">'+"Screen limit exceeded"+'</p>');
    } else{
    firstLineArr.push(key);
    $("#screenRow1").replaceWith('<p id="screenRow1">'+firstLineArr.join('')+'</p>');
      }
    //}
  }
  
  function updateScreenRow2 (key){
    if (key === undefined){
      $("#screenRow2").replaceWith('<p id="screenRow2">00000000000</p>');
      return;
    }
    if(secondLineArr.length>=23){
        limit = true;
        $("#screenRow2").replaceWith('<p id="screenRow2">'+"Screen limit exceeded"+'</p>');
      return;
    }
    if(key === "zero"){
      $("#screenRow2").replaceWith('<p id="screenRow2">0</p>');
      return;
    }
    if(key === "result"){
      if(secondLineArr.length + numArr.length <22){
      $("#screenRow2").replaceWith('<p id="screenRow2">'+secondLineArrBackUp.join('')+"="+numArr.join('')+'</p>');
      return;
      }else if(numArr.length < 22){
              $("#screenRow2").replaceWith('<p id="screenRow2">='+numArr+'</p>');
      return;
      } else{
         $("#screenRow2").replaceWith('<p id="screenRow2">'+"Screen limit exceeded"+'</p>');
      }
    }
    else{
      secondLineArr.push(key);
    $("#screenRow2").replaceWith('<p id="screenRow2">'+secondLineArr.join('')+'</p>');
         }
  }
  
  function radic(arr){
    var i = arr.length-2;
    var temp;
        while(!isNaN(arr[i]) || arr[i] === "." && i>=0 ){
      i--;
        }
          temp = arr.splice(arr.length-1);
        if(i !== 0){
          temp = arr.splice(i+1);
        }else{temp = arr.splice(i);}
          temp = Math.round10(Math.sqrt(parseInt(temp.join(''), 10)), -5).toString().split('');
          temp.forEach( (a) => arr.push(a) );
          temp = arr.pop();
          updateScreenRow2(temp);
          
    return;
  }
  
  function getNum(arr){
    var i = 0;
    var temp;

    while((!isNaN(arr[i]) || arr[i] === "." || arr[i] === "-") && i <= arr.length ){
      i++;  
  }
    temp = arr.splice(0,i);
    numArr.push(temp.join(''));
    temp = arr.splice(0,1);
    if(temp[0] === undefined){return;}
    opArr.push(temp[0]);
    if(arr.length <= 0){return;}
    getNum(arr);
  }
  
  function doMath(){
    const add = (a,b) => parseFloat(a)+parseFloat(b);
    const subtract = (a,b) =>  a-b;
    const multiply = (a,b) => a*b;
    const divide = (a,b) => a/b;
    const squareRoot = (a) => Math.sqrt(a);
    const powerOf = (a,b) => Math.pow(a,b);
    var signLocation = [];
    
    function signs(sign){
      signLocation = [];
      for(i = 0; i<opArr.length; i++){
        if(opArr[i] === sign){
          signLocation.push(i);
        }
      }
      opArr = opArr.filter((value) => value !== sign);
      return;
    }
    
    signs("^");
      if(signLocation[0] !== undefined){
        for(i=signLocation.length-1; i>-1; i--){
          numArr[signLocation[i]] = powerOf(numArr[signLocation[i]], numArr[signLocation[i]+1]);
          numArr.splice(signLocation[i]+1, 1);
        }
      }
    
    signs("*");
      if(signLocation[0] !== undefined){
        for(i=signLocation.length-1; i>-1; i--){
          numArr[signLocation[i]] = multiply(numArr[signLocation[i]], numArr[signLocation[i]+1]);
          numArr.splice(signLocation[i]+1, 1);
        }
      }
    
    signs("&divide;");
      if(signLocation[0] !== undefined){
        for(i=signLocation.length-1; i>-1; i--){
          numArr[signLocation[i]] = divide(numArr[signLocation[i]], numArr[signLocation[i]+1]);
          numArr.splice(signLocation[i]+1, 1);
        }
      }

    opArr.reverse();
    numArr.reverse();
    for(i=opArr.length-1; i>-1; i--){
      if(opArr[i] === "+"){
        numArr[i] = add(numArr[i+1], numArr[i]);
        numArr.splice(i+1, 1);
      } else if(opArr[i] === "&minus;"){
        numArr[i] = subtract(numArr[i+1], numArr[i]);
        numArr.splice(i+1, 1);
      }
    }

    numArr = Math.round10(numArr, -5).toString().split('');
    return;
  }
  
  function equals(arr){
    getNum(arr);
    doMath();
    
    updateScreenRow1("result");
    if(numArr[0] === "-") { numArr.unshift(parseInt(numArr.shift()+numArr.shift(),10)) }
    secondLineArr = numArr;
    updateScreenRow2("result");
    return;
  }

$("#one").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(1);
  updateScreenRow2(1);
});
  
$("#two").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(2);
  updateScreenRow2(2);  
});
  
$("#three").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(3);
  updateScreenRow2(3);
});
  
$("#four").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(4);
  updateScreenRow2(4);
});
  
$("#five").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(5);
  updateScreenRow2(5);
});
  
$("#six").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(6);
  updateScreenRow2(6);  
});
  
$("#seven").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(7);
  updateScreenRow2(7);
});
  
$("#eight").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(8);
  updateScreenRow2(8);  
});
  
$("#nine").on('click', function(){
  if(equalsBool){ return; }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;  
  updateScreenRow1(9);
  updateScreenRow2(9);
});
  
$("#zero").on('click', function(){
  if(equalsBool){ return; }
    var zero = 0;
  if(firstLineArr.length<2){
  for(i=0; i<firstLineArr.length; i++){
    if(firstLineArr[i] === 0){zero++}
    if (zero>=1){ return; }
  }
  }  
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  if(firstLineArr[0] === "&radic;"){ return; }
  operand = false;
  updateScreenRow1(0);
  updateScreenRow2(0); 
});
  
$("#decimal").on('click', function(){
  if(equalsBool){ return; }
  var decimal = 0;
  for(i=0; i<firstLineArr.length; i++){
    if(firstLineArr[i] === "."){decimal++}
    if (decimal>=1){ return; }
  }
  if(operand){ firstLineArr = clearOperand(firstLineArr) }
  operand = false;
  updateScreenRow1(".");
  updateScreenRow2("."); 
});
  
$("#AC").on('click', function(){ 
  firstLineArr = [];
  secondLineArr = [];
  updateScreenRow1();
  updateScreenRow2();
  equalsBool = false;
  limit = false;
});
  
$("#CE").on('click', function(){ 
  if(limit){return}
    equalsBool = false;
    firstLineArr = [];
    updateScreenRow1("zero");
  if(firstLineArr.join('') === secondLineArr.join('')){
    secondLineArr = [];
    updateScreenRow2("zero");
    limit = false;
    operand = true;
    return;  
  }
  if (firstLineArr.slice(0,1)[0] === "&radic;"){
  i = opSearch(secondLineArr, -1);
    if(i == -1){
      secondLineArr = [];
      updateScreenRow2("zero");
      limit = false;
      operand = true;
      return; 
    } else{
    secondLineArr.splice(i+1);
    updateScreenRow2(secondLineArr.pop());
    limit = false;
    return; 
      }
  }
  
    i = opSearch(secondLineArr, -1);
  console.log(i);
      if(i == 0){
      secondLineArr = [];
      updateScreenRow2("zero");
      limit = false;
      operand = true;
      return; 
    } else{
    secondLineArr.splice(i+1);
    updateScreenRow2(secondLineArr.pop());
    limit = false;
    return; 
      }
  
  
  limit = false;
  return;
});  
  
$("#add").on('click', function(){
  if(operand){ secondLineArr = clearOperand(secondLineArr); }
   firstLineArr = [];
   updateScreenRow1("+");
   updateScreenRow2("+");
   equalsBool = false;
   operand = true;  
});  
  
$("#subtract").on('click', function(){
  if(operand){ secondLineArr = clearOperand(secondLineArr); }
  firstLineArr = [];
  updateScreenRow1("&minus;");
  updateScreenRow2("&minus;");
  equalsBool = false;
  operand = true;  
}); 
  
$("#multiply").on('click', function(){
  if(operand){ secondLineArr = clearOperand(secondLineArr); }
  firstLineArr = [];
  updateScreenRow1("*");
  updateScreenRow2("*");
  equalsBool = false;
  operand = true;  
}); 
  
$("#divide").on('click', function(){
  if(operand){ secondLineArr = clearOperand(secondLineArr); }
  firstLineArr = [];
  updateScreenRow1("&divide;");
  updateScreenRow2("&divide;");
  equalsBool = false;
  operand = true;  
});
 
//can add numbers after a square root. need to prevent this
$("#sqrRoot").on('click', function(){
  if(operand){ return; }
  console.log(firstLineArr);
  if(firstLineArr === undefined){ return; }
  updateScreenRow1("&radic;");
  if(secondLineArr[0] === "&radic;"){
    secondLineArr.push(secondLineArr.shift());
  }else{
  secondLineArr.push("&radic;");
  }
  radic(secondLineArr);
  operand = false;  
});
  
$("#toTheNth").on('click', function(){
  if(operand){ secondLineArr = clearOperand(secondLineArr); }
  firstLineArr = [];
  updateScreenRow1("^");
  updateScreenRow2("^");
  equalsBool = false;
  operand = true;  
});
  
$("#pi").on('click', function(){
  if(equalsBool){ return; }
  firstLineArr = [3, ".", 1, 4, 1, 5];
  updateScreenRow1(9);
  secondLineArr.push(3);
  secondLineArr.push(".");
  secondLineArr.push(1);
  secondLineArr.push(4);
  secondLineArr.push(1);
  secondLineArr.push(5);
  updateScreenRow2(9);
  operand = false;  
});

$("#negPos").on('click', function(){
  i = opSearch(secondLineArr, -1);
  if(i === 0){
  if(secondLineArr[i]>0){
    secondLineArr[i] = parseInt("-"+secondLineArr[i]);
    updateScreenRow1("neg");
    updateScreenRow2(secondLineArr.pop());
    return;
  }else if(secondLineArr[i]<0){
    secondLineArr.splice([i],1, secondLineArr[i]*-1);
    updateScreenRow1("pos");
    updateScreenRow2(secondLineArr.pop());
    return;
    }
  }else{
      if(secondLineArr[i+1]>0){
    secondLineArr[i+1] = parseInt("-"+secondLineArr[i+1]);
    updateScreenRow1("neg");    
    updateScreenRow2(secondLineArr.pop());
    return;    
  }else if(secondLineArr[i+1]<0){
    secondLineArr.splice([i+1],1, secondLineArr[i+1]*-1);
    updateScreenRow1("pos");
    updateScreenRow2(secondLineArr.pop());
    return;
    }
  }
});  
 
$("#equals").on('click', function(){
  if(!operand && !equalsBool){
    numArr = [];
    opArr = [];
    secondLineArrBackUp = [];
    for(i=0; i<secondLineArr.length; i++){
      secondLineArrBackUp[i] = secondLineArr[i];
    }
    equals(secondLineArr);
    equalsBool = true;
    return;
  } 

 return;
});

});//end document ready function