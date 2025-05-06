document.addEventListener("DOMContentLoaded", function () {
  // 모달 관련 요소 가져오기
  const modal = document.querySelector('.modal'); // 모달 창
  const modalOpen = document.querySelector('.modal_btn'); // 열기 버튼
  const modalClose = document.querySelector('.close_btn'); // 닫기 버튼
  const overlay = document.querySelector(".modal-overlay");
  const saveTargetButton = document.getElementById("saveTarget"); // 저장 버튼
  const targetDisplay = document.getElementById("targetDisplay");
  const targetDisplay2 = document.getElementById("targetDisplay2");
  const targetDisplay3 = document.getElementById("targetDisplay3");
  const targetDisplay4 = document.getElementById("targetDisplay4");
  const targetDisplay5 = document.getElementById("targetDisplay5");
  

  // 현재 로그인한 사용자 이름 가져오기 (환영 메시지에서 추출)
  const username = new URLSearchParams(window.location.search).get("username");

  if (username) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `환영합니다, ${username}님!`;
  } else {
    // username이 없을 경우 기본 메시지 표시
    alert("사용자 정보가 없습니다. 다시 로그인해주세요.");
    window.location.href = "index.html"; // 로그인 페이지로 리다이렉션
  }

  // 로컬 스토리지에서 데이터 불러오기
  function loadTarget() {
      const savedTargets = JSON.parse(localStorage.getItem("User_target")) || [];
      const userTarget = savedTargets.find(target => target.username === username);

      if (userTarget) {
          targetDisplay.innerHTML = `현재 몸무게<br>${userTarget.weightNow} kg`,
          targetDisplay2.innerHTML=`신장<br>${userTarget.height} cm`,
          targetDisplay3.innerHTML=`현재 근육량<br>${userTarget.muscleNow} kg`,
          targetDisplay4.innerHTML=`근육량 목표<br>${userTarget.target_muscle}`,
          targetDisplay5.innerHTML=`체중 목표<br>${userTarget.target_weight}`;
      } else {
        targetDisplay.innerHTML = `현재 몸무게<br>NaN`,
        targetDisplay2.innerHTML=`신장<br>NaN`,
        targetDisplay3.innerHTML=`현재 근육량<br>NaN`,
        targetDisplay4.innerHTML=`근육량 목표<br>NaN`,
        targetDisplay5.innerHTML=`체중 목표<br>NaN`;
      }
  }

  // 데이터 저장 함수
  function saveTarget(target) {
      const savedTargets = JSON.parse(localStorage.getItem("User_target")) || [];

      // 기존 사용자 데이터 삭제
      const updatedTargets = savedTargets.filter(t => t.username !== username);

      // 새로운 데이터 추가
      updatedTargets.push(target);

      localStorage.setItem("User_target", JSON.stringify(updatedTargets));
  }

  // 저장 버튼 클릭 시 선택된 값 처리
  saveTargetButton.addEventListener("click", function () {
      const age = Number(document.getElementById("age").value);//나이
      const weightNow = Number(document.getElementById("weightNow").value); // 현재 몸무게
      const height = Number(document.getElementById("height").value); // 신장
      const muscleNow = Number(document.getElementById("muscleNow").value); // 현재 근육량
      const muscle = document.getElementById("target_muscle").value; // 근육량 목표
      const weightGoal = document.getElementById("target_weight").value; // 체중 목표
      if(muscleNow > weightNow){
        alert("근육량은 체중보다 클수 없습니다.");
      }
      else{
        if (weightNow && height && muscleNow && target_muscle && target_weight) {
            const target = {
                age: age,
                username: username, // 현재 로그인한 사용자 이름 추가
                weightNow: weightNow,
                height: height,
                muscleNow: muscleNow,
                target_muscle: muscle,
                target_weight: weightGoal,
            };
  
            saveTarget(target); // 로컬 스토리지에 저장
            document.getElementById("weightNow").value = "";
            document.getElementById("height").value = "";
            document.getElementById("muscleNow").value = "";
            loadTarget(); // 화면에 표시
  
            alert("운동 목표가 저장되었습니다.");
            modal.style.display = "none"; // 모달 닫기
            overlay.style.display = "none";
            document.body.style.overflow = 'auto';
        } else {
            alert("모든 항목을 입력해주세요.");
        }
      }

  });

  // 모달 열기 버튼 클릭 시 모달 열기
  modalOpen.addEventListener('click', function () {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden'
  });

  // 닫기 버튼 클릭 시 모달 닫기
  modalClose.addEventListener('click', function () {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
  });

  // 페이지 로드 시 저장된 데이터 불러오기
  loadTarget();
});


document.addEventListener("DOMContentLoaded", function () {
    const logList = document.getElementById("logList"); // 오늘의 활동 리스트
    const logList2 = document.getElementById("logList2");
    const logExerciseButton = document.getElementById("logExercise"); // 운동 기록 추가 버튼
    const logMealButton = document.getElementById("logMeal"); // 식단 기록 추가 버튼

    // 현재 날짜를 YYYY-MM-DD 형식으로 반환
    function getTodayDate() {
        const now = new Date();
        //now.setDate(now.getDate() + 1)
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    // 현재 날짜와 시간을 포맷팅
    function getCurrentTimestamp() {
        const now = new Date();
        //테스트용 코드
        //now.setDate(now.getDate() - 1)
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }

    // 로컬 스토리지에서 데이터 불러오기
    function loadLogs() {
        const logs = JSON.parse(localStorage.getItem("dailyLogs")) || []; 
        const todayDate = getTodayDate(); 
        logList.innerHTML = ""; 
        logList2.innerHTML = "";

        logs.forEach(log => {
            // 저장된 로그의 날짜가 오늘인 경우만 출력
            if (log.timestamp.startsWith(todayDate)) {
                if (log.type === "운동 기록") {
                    const listItem = document.createElement("li");
        
                    // 시간만 추출하고 오전/오후 형식으로 변환
                    const time = log.timestamp.split(" ")[1]; 
                    const [hours, minutes] = time.split(":").map(Number); 
                    const period = hours >= 12 ? "오후" : "오전";
                    const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
                    const formattedTime = `${period} ${formattedHours}:${String(minutes).padStart(2, "0")}`;
        
                    listItem.textContent = `${formattedTime} - ${log.type}: ${log.details} ${log.details2}`;
                    logList.appendChild(listItem);
                }
            }
        });
        

        logs.forEach(log => {
            // 저장된 로그의 날짜가 오늘인 경우만 출력
            if (log.timestamp.startsWith(todayDate)) {
                if (log.type === "식단 기록") {
                    const listItem = document.createElement("li");
        
                    // 시간만 추출하고 오전/오후 형식으로 변환
                    const time = log.timestamp.split(" ")[1];
                    const [hours, minutes] = time.split(":").map(Number); 
                    const period = hours >= 12 ? "오후" : "오전"; 
                    const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours; 
                    const formattedTime = `${period} ${formattedHours}:${String(minutes).padStart(2, "0")}`;
        
                    listItem.textContent = `${formattedTime} - ${log.type}: ${log.details} ${log.details2}`;
                    logList2.appendChild(listItem);
                }
            }
        });
        
    }

    // 로컬 스토리지에 데이터 저장
    function saveLog(log) {
        const logs = JSON.parse(localStorage.getItem("dailyLogs")) || [];
        logs.push(log); 
        localStorage.setItem("dailyLogs", JSON.stringify(logs)); 
    }

    // 운동 기록 추가
    logExerciseButton.addEventListener("click", function () {
        const exercise = document.getElementById("exercise").value.trim();
        const duration = document.getElementById("duration").value.trim();

        if(duration >= 0){
            if (exercise && duration) {
                const log = {
                    timestamp: getCurrentTimestamp(),
                    type: "운동 기록",
                    details: `${exercise}`,
                    details2:`(${duration}회)`
                };
                saveLog(log); 
                document.getElementById("exercise").value = "";
                document.getElementById("duration").value = "";
                loadLogs();
                alert("운동 기록이 추가되었습니다.");
            } else {
                alert("운동 이름과 양을 모두 정확하게 입력해주세요.");
            }
        }else{
            alert("운동 이름과 양을 모두 정확하게 입력해주세요.");
        }
        
    });

    // 식단 기록 추가
    logMealButton.addEventListener("click", function () {
        const meal = document.getElementById("meal").value.trim();
        const calories = document.getElementById("calories").value.trim();
        if(calories >= 0){
            if (meal && calories) {
                const log = {
                    timestamp: getCurrentTimestamp(),
                    type: "식단 기록",
                    details: `${meal}`,
                    details2:`(${calories}kcal)`
                };
                saveLog(log); 
                document.getElementById("meal").value = "";
                document.getElementById("calories").value = "";
                loadLogs();
    
                alert("식단 기록이 추가되었습니다.");
            }
            else {
                alert("음식 이름과 칼로리를 모두 정확하게 입력해주세요.");
            }
        }
        else{
            alert("음식 이름과 칼로리를 모두 정확하게 입력해주세요.")
        }

    });

    
    loadLogs();
});

function getLast7Days() {
    const days = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        days.unshift(`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`);
    }

    return days; 
}


function getLogsForLast7Days() {
    const logs = JSON.parse(localStorage.getItem("dailyLogs")) || [];
    const last7Days = getLast7Days(); 
    const filteredLogs = [];

    last7Days.forEach(date => {
        const logForDate = logs.filter(log => log.timestamp.startsWith(date));
        if (logForDate.length > 0) {
            filteredLogs.push({
                date: date,
                logs: logForDate
            });
        }
    });

    return filteredLogs;
}

// 차트 데이터
function generateChartData() {
    const last7Days = getLast7Days(); 
    const logsForLast7Days = getLogsForLast7Days(); 

   
    const chartLabels = [];
    const exerciseData = []; 
    const calorieIntakeData = []; 
    const calorieBurnData = []; 

    last7Days.forEach(date => {
        chartLabels.push(date); 

        const logForDate = logsForLast7Days.find(log => log.date === date);
        if (logForDate) {
            const totalExerciseTime = logForDate.logs.reduce((sum, log) => {
                if (log.type === "운동 기록" && log.details2) {
                    const durationMatch = log.details2.match(/(\d+)\s*회/);
                    if (durationMatch) {
                        return sum + parseInt(durationMatch[1], 10);
                    }
                }
                return sum;
            }, 0);

            const totalCalorieIntake = logForDate.logs.reduce((sum, log) => {
                if (log.type === "식단 기록" && log.details2) {
                    const calorieMatch = log.details2.match(/(\d+)\s*kcal/);
                    if (calorieMatch) {
                        return sum + parseInt(calorieMatch[1], 10);
                    }
                }
                return sum;
            }, 0);

            const totalCalorieBurn = Math.round(totalExerciseTime * 0.694);

            exerciseData.push(totalExerciseTime);
            calorieIntakeData.push(totalCalorieIntake);
            calorieBurnData.push(totalCalorieBurn);
        } else {
            exerciseData.push(0);
            calorieIntakeData.push(0);
            calorieBurnData.push(0);
        }
    });

    return { labels: chartLabels, exerciseData, calorieIntakeData, calorieBurnData };
}



// 차트 생성
function createChart() {
    const { labels, exerciseData, calorieIntakeData, calorieBurnData } = generateChartData();

    const ctx = document.getElementById("progressChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "운동량 (회)",
                    data: exerciseData,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                },
                {
                    label: "섭취 칼로리 (kcal)",
                    data: calorieIntakeData,
                    backgroundColor: "rgba(255,99,132,0.4)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                },
                {
                    label: "소모 칼로리 (kcal)",
                    data: calorieBurnData,
                    backgroundColor: "rgba(54,162,235,0.4)",
                    borderColor: "rgba(54,162,235,1)",
                    borderWidth: 1,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "날짜" } },
                y: { 
                    title: { display: true, text: "값" },
                    beginAtZero: true // Y축 최소값을 0
                },
            },
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {
    createChart();
});


function analyzeProgress() {
    const username = new URLSearchParams(window.location.search).get("username");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(user => user.username === username);
    const sex = currentUser.sex;
    const {exerciseData, calorieIntakeData, calorieBurnData } = generateChartData();

    const savedTargets = JSON.parse(localStorage.getItem("User_target")) || [];
    const userTarget = savedTargets.find(target => target.username === username);

    // 기초대사량 계산
    let bmr = 0;
    if (sex === "남성") {
        bmr = Math.round(66.47 + (13.75 * userTarget.weightNow) + (5 * userTarget.height) - (6.76 * userTarget.age));
    } else if (sex === "여성") {
        bmr = Math.round(655.1 + (9.56 * userTarget.weightNow) + (1.85 * userTarget.height) - (4.68 * userTarget.age));
    }

    const totalCaloriesOut = bmr + calorieBurnData[6];
    const calorieBalance = calorieIntakeData[6] - totalCaloriesOut;
    const target_muscle = userTarget.target_muscle;
    const target_weight = userTarget.target_weight;

    // 조언 메시지
    let adviceMessage = `당신의 기초대사량은 ${bmr}kcal 이며, `;

    if (calorieBalance > 0) {
        adviceMessage += `오늘 섭취한 칼로리가 소모한 칼로리보다 ${calorieBalance}kcal 많습니다.<br>체중 증가 가능성이 있습니다. `;
        if(target_weight === '체중 증량'){
            adviceMessage += "잘 하고 있습니다. 현재 페이스를 유지하세요!"
        }else if (target_weight === '체중 감량'){
            adviceMessage += "목표에 도달하기엔 부족한것 같습니다. 내일은 운동량을 조금 더 늘려보세요!";
        }
        
    } else if (calorieBalance < 0) {
        adviceMessage += `오늘 소모한 칼로리가 섭취한 칼로리보다 ${Math.abs(calorieBalance)}kcal 많습니다.<br>체중 감소 가능성이 있습니다. `;
        if(target_weight === '체중 증량'){
            adviceMessage += "목표에 도달하기엔 부족한것 같습니다. 내일은 식사량을 조금 더 늘려보세요!";
        }else if(target_weight === '체중 감량'){
            adviceMessage += "잘 하고 있습니다. 현재 페이스를 유지하세요!";
        }

    } else {
        adviceMessage += "섭취한 칼로리와 소모한 칼로리가 균형을 이루고 있습니다.<br>체중 유지 가능성이 높습니다.";
    }
    adviceMessage += "<br> 또한, ";
    if(exerciseData[6] >= 600){
        if(target_muscle === '근육 유지'){
            adviceMessage += "현재 운동량으로는 근육이 증가할 가능성이 있습니다. 운동량을 약간 조절해주세요.";
        }else if(target_muscle === '근육 증량'){
            adviceMessage += "현재 운동량으로는 근육이 증가할 가능성이 있습니다. 잘 하고 있습니다. 현재 페이스를 유지하세요!";
        }else if(target_muscle === '근육 감량'){
            adviceMessage += "현재 운동량으로는 근육이 증가할 가능성이 있습니다. 근육 감량을 위해서 운동량을 줄여주세요.";
        }
    }else if(60 > exerciseData[6] >= 300){
        if(target_muscle === '근육 유지'){
            adviceMessage += "현재 운동량으로는 근육이 유지될 가능성이 있습니다. 잘 하고 있습니다. 현재 페이스를 유지하세요!";
        }else if(target_muscle === '근육 증량'){
            adviceMessage += "현재 운동량으로는 근육이 유지될 가능성이 있습니다. 운동량을 늘려주세요.";
        }else if(target_muscle === '근육 감량'){
            adviceMessage += "현재 운동량으로는 근육이 유지될 가능성이 있습니다. 근육 감량을 위해서 운동량을 줄여주세요.";
        }
    }else{
        if(target_muscle === '근육 유지'){
            adviceMessage += "현재 운동량으로는 근육이 감소될 가능성이 있습니다. 운동량을 늘려주세요.";
        }else if(target_muscle === '근육 증량'){
            adviceMessage += "현재 운동량으로는 근육이 감소될 가능성이 있습니다. 운동량을 많이 늘려주세요.";
        }else if(target_muscle === '근육 감량'){
            adviceMessage += "현재 운동량으로는 근육이 감소될 가능성이 있습니다. 잘 하고 있습니다. 현재 페이스를 유지하세요!";
        }
    }




    //ocument.getElementById("adviceMessage").textContent = adviceMessage;
    document.getElementById("adviceMessage").innerHTML = adviceMessage
}

// 페이지 로드 시 분석 수행
document.addEventListener("DOMContentLoaded", function () {
    analyzeProgress();
});



