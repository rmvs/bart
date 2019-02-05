$(document).ready(function() { 

    // initialize values
    var round = 0;
    var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
    var increase = 2; // number of pixels by which balloon is increased each pump
    var size; // start_size incremented by 'increase'
    var pumps; 
    var thanks;
    var maximal_pumps=32;
    var pumpmeup; // number pumps in a given round; is updated each round
    var number_pumps = []; // arrays for saving number of pumps
    var total = 0; // money that has been earned in total
    var explosion; // will an explosion occur? 1 = yes, 0 = no
    var last_win = 0; // initialize variable that contains the win of the previous round
    var present_win = 0; //initialize variable of win in present around
    var rounds_played = 2;
    var exploded = []; // array for saving whether ballon has exploded
    var explode_array = [15, 9/*, 16, 26, 22, 8, 27, 17, 23, 2, 8, 12, 6, 4*/];
    var time_interval;
    var minute = 0,second = 0;
    var elapsed;
    var total_elapsed_arr = [];
    var sum_total_elapsed = 0;
    var time_between_pumps = [];
    var number_explosion = 0;
    var number_pumps_no_exp = 0;
    var exploded_rounds = [];
    var not_exploded_rounds = [];
                          
    // initialize language
    var label_press = 'Inflate balloon';
    var label_collect = 'Collect';
    var label_balance = 'Total credit:';
    var label_last = 'Win last round:';
    var label_currency = ' points';
    var label_times=' times';
    var label_header = 'Balloon Game Round ';
    var label_gonext1 = 'Start next round';
    var label_gonext2 = 'end game';
    var msg_explosion1 = '<p> The balloon is exploded after puming ';
    var msg_explosion2 = ' times.</p> <p>Once inflated burst, you did not make any money this round </p>';
    var label_present_time = 'Pumping times:';
    var label_present_value = 'Earn this round:';		
  
    
    var msg_collect1 = '<p> The balloon did not burst! </ p> <p> You deserve this round ';
    var msg_collect2 = ' Points. </ p> <p> The money earned is safe in the bank.</p>';
  
    var msg_end1 = '<p> This completes this part of the study. You are in the balloon game ';
    var msg_end2 = ' points made profit. </ p> <p> Click <i> Next </ i> to continue the study. </ p>';

    $('#next').hide();
    
    
    // initialize labels 
    $('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total+label_currency);
    $('#last_term').html(label_last);
    $('#last_value').html(last_win+label_currency);
    $('#present_value_term').html(label_present_value);
    $('#present_times_term').html(label_present_time);
    $('#present_value').html(present_win+label_currency);
    $('#present_times').html(pumpmeup+label_times);
    $('#outcomes').html(number_pumps);    
    
    // below: create functions that define game functionality
      
      var start_timer = function(){
          if(round <= 9){
            total_elapsed_arr[round] = new Date();
          }
          time_interval =  setInterval(function(){			
              if(second >= 59){
                  second = -1;
                  minute++;
              }
              $('#time').text( ('0' + minute).slice(-2)  +  ':' + ('0' + (++second)).slice(-2) );			
          },1000);		
      }
      
      var stop_timer = function(){		
          if(round <= 10){
            total_elapsed_arr[round-1] = new Date() - total_elapsed_arr[round-1];
            sum_total_elapsed += total_elapsed_arr[round-1];
          }
          clearInterval(time_interval);
      }
    
    // what happens when a new round starts
    var new_round = function() {
      start_timer();
      $('#gonext').hide();
      $('#message').hide();  
      $('#collect').show();
      $('#press').show();
      $('#present_times').show();
      $('#present_value').show();
      round += 1;
      size = start_size;
      pumps = 0;
      present_win =0;
      show_present();
      show_present_earns();
      $('#ballon').width(size); 
      $('#ballon').height(size);
      $('#ballon').show();
      $('#round').html('<h2>'+label_header+round+'<h2>');
      $('#present_round').show();
      $('#outcomes').hide();
      $('#NextButton').hide();
    };
    
    // what happens when the game ends
    var end_game = function() {
      $('#total').remove();
      $('#collect').remove();
      $('#ballon').remove();
      $('#press').remove();
      $('#gonext').remove();
      $('#round').remove();
      $('#last_round').remove();
      $('#goOn').show();
      $('#message').html(msg_end1+total+msg_end2).show();
      $('#outcomes').show();
      $('#NextButton').show();
      $('#next').show();
      $('#results').show();
      $('#bigwrap').hide();

      Qualtrics.SurveyEngine.setEmbeddedData('number_pumps',number_pumps);
      Qualtrics.SurveyEngine.setEmbeddedData('exploded',exploded);
      Qualtrics.SurveyEngine.setEmbeddedData('total_win',total);
  
      
    };
    
    // message shown if balloon explodes
    var explosion_message = function() {
      $('#collect').hide();
      $('#press').hide();
      $('#message').html(msg_explosion1+pumpmeup+msg_explosion2).show();
    };
    
    // message shown if balloon does not explode
    var collected_message = function() {
      $('#collect').hide();
      $('#press').hide();    
      $('#message').html(msg_collect1+present_win+msg_collect2).show();
    };  
  
    // animate explosion using $ UI explosion
    var balloon_explode = function() {
      $('#ballon').hide( "explode", {pieces: 100}, 800 );
      document.getElementById('explosion_sound').play();
    };  
    
    // show button that starts next round
    var gonext_message = function() {
      $('#ballon').hide();
      if (round < rounds_played) {
        $('#gonext').show();
        $('#gonext_button').html(label_gonext1);
      }
      else {
        $('#gonext').show();
        $('#gonext_button').html(label_gonext2);
      }
    };
  
    // add money to bank
    var increase_value = function() {
      $('#total_value').html(total+label_currency);
    };
    
    var show_last = function() {
      $('#last_value').html(last_win+label_currency);
    };
    var show_present=function(){
      $('#present_times').html(pumps+label_times)
    }
    var show_present_earns=function(){
      $('#present_value').html(present_win+label_currency)
    }
     var show_array=function(){
         $('#pump_array').html(number_pumps)
     }
    
    // button functionalities
    
    // pump button functionality -> 'pressure' in slider bar increases
    $('#press').click(function() {	
      if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable	 
        explosion = 0; // is set to one if pumping goes beyond explosion point; see below
        pumps += 1;
        present_win +=0.25;
        if (pumps < explode_array[round-1]) {
          if(!time_between_pumps[round-1]){
            time_between_pumps[round-1] = [];
          }
          if(!elapsed){
            elapsed = new Date();
          }else{
            time_between_pumps[round-1].push(Math.abs((new Date() - elapsed)/1000));			    
            elapsed = new Date();
          } 
          if(round <= 10){
            number_pumps_no_exp++;
          }     
          size +=increase;
          $('#ballon').width(size); 
          $('#ballon').height(size);
          show_present();
          show_present_earns();
          not_exploded_rounds.push(round);
        }
        else {
      stop_timer();
      elapsed = null;
      last_win = 0;
      pumpmeup = pumps;
      pumps = -1; // makes pumping button unclickable until new round starts
      explosion = 1; // save that balloon has exploded this round
      if(round <= 10){
        number_explosion++;
      }
      exploded_rounds.push(round);      
      balloon_explode();
      exploded.push(explosion); // save whether balloon has exploded or not      
      number_pumps.push(pumpmeup); // save number of pumps
      setTimeout(explosion_message, 1200);
      setTimeout(gonext_message, 1200);
      setTimeout(show_last, 1200);
        }
      }
    });
    
    
    // collect button: release pressure and hope for money
    $('#collect').click(function() {
        if (pumps === 0) {
      alert('you can only collect the money once you click "给气球充气”。');
        }
        else if (pumps > 0) { // only works after at least one pump has been made
      elapsed = null;
      stop_timer();
      not_exploded_rounds.push(round);
      time_between_pumps[round-1].push(Math.abs((new Date() - elapsed)/1000));
      exploded.push(explosion); // save whether balloon has exploded or not
      document.getElementById('tada_sound').play();
      number_pumps.push(pumps); // save number of pumps
      pumpmeup = pumps;
      pumps = -1; // makes pumping button unclickable until new round starts
      $('#ballon').hide();
      $('#present_round').hide();
      collected_message();
      gonext_message();
      total += present_win;
      last_win = present_win;
      increase_value();
      show_last();
        }
    });
    
    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext_button').click(function() {
      if (round < rounds_played) {
        minute = second = 0;	
        new_round();
      }
      else {
        end_game();
      }
    });  
  
  
    // start the game!
    new_round();

});