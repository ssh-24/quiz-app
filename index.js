(() => {
  ("use strict");

  const get = (element) => document.querySelector(element);

  const data = [
    {
      question:
        "1. canvas의 context를 사용하여 전체 화면을 지우기 위해서 사용하는 구문 중 알맞은 것은?",
      options: [
        "context.clear(0, 0, canvas.width, canvas.height);",
        "context.clear(0, 9999, canvas.width, canvas.height);",
        "context.clearRect(0, 9999, canvas.width, canvas.height);",
        "context.clearRect(0, 0, canvas.width, canvas.height);"
      ],
      answer: "context.clearRect(0, 0, canvas.width, canvas.height);"
    },

    {
      question: "2. constructor의 뜻은?",
      options: [
        "Class의 객체들을 외부로 리턴하기 위한 클로저 함수입니다.",
        "Class의 인스턴스 객체를 생성하고 초기화하는 메서드입니다.",
        "Class를 자식 인스턴스로 두고 사용하는 메서드입니다.",
        "Class를 부모 인스턴스로 두는 전역함수입니다."
      ],
      answer: "Class의 인스턴스 객체를 생성하고 초기화하는 메서드입니다."
    },

    {
      question: '3. const result = (2 + 3 + "5"); 이 코드의 결과 값은?',
      options: ["10", "235", "55", "28"],
      answer: "55"
    },

    {
      question: "4. 다음 중 참조타입의 변수인 것은?",
      options: [
        "const newVar = [];",
        "const newVar = 10;",
        'const newVar = "하이"',
        'const newVar = ""'
      ],
      answer: "const newVar = [];"
    },

    {
      question:
        "5. 다음중 캔버스를 사용하여 사각형을 그릴 때 사용하는 메서드는?",
      options: [
        "ctx.Rectangle(25,25,100,100)",
        "ctx.recTangle(25,25,100,100)",
        "ctx.fillRect(25,25,100,100)",
        "ctx.clearRect(25,25,100,100)"
      ],
      answer: "ctx.fillRect(25,25,100,100)"
    }
  ];

  class QuizApp {
    constructor() {
      this.questions = data;
      this.limit = 10; // 제한시간
      this.score = 0; // 득점 현황
      this.time = 0;
      this.line = 0;
      this.number = 1; // 문제 번호
      this.count = 0; // 배열 인덱스
      this.$start = get(".js-start");
      this.$restart = get(".js-restart");
      this.$next = get(".js-next");
      this.$quizBox = get(".quiz_box");
      this.$resultBox = get(".result_box");
      this.$title = get(".quiz_question"); // 문제
      this.$options = get(".options"); // 선택지
      this.$quizCount = get(".totals");
      this.$scores = get(".scores");
      this.$time = get(".time"); // 남은 시간 span
      this.$line = get(".line");
      this.timer = "";
      this.liner = "";
      this.events();
    }

    events() {
      this.$start.onclick = () => this.gameStart();
      this.$restart.onclick = () => this.gameStart();
      this.$next.onclick = () => {
        // 마지막 문제일 경우 결과 반환
        if (this.questions.length - 1 <= this.count) {
          this.getResult();
          return;
        }
        this.count++;
        this.number++;
        this.gameOptions();
        this.$next.classList.remove("active");
      };
    }

    gameOptions() {
      this.limit = 10;
      this.time = 0;
      this.line = 0;
      this.getQuestion();
      this.getQuestionCounter();
      this.setTime();
      this.setLine();
    }


    // 퀴즈 시작시 필요한 동작 구현
    gameStart() {
      if (this.$resultBox.classList.contains("active")) {
        this.$resultBox.classList.remove("active");
        this.$next.classList.remove("active"); // 다음 문제 버튼 비활성화
      }
      this.$quizBox.classList.add("active");
      this.score = 0;
      this.number = 1;
      this.count = 0;
      this.gameOptions();
    }


    // 정답 여부 체크
    checkCorrect(text) {
      // 파라미터로 들어오는 text를 검증해서 true 또는 false를 리턴
      if (text === this.questions[this.count].answer) {
        return true;
      } else return false;
    }

    getSelected($this) {
      // 제한시간 안에 선택시 타이머, 진행바 종료 
      this.limit = 0;
      this.line = 100;
      this.setAllDisabled(); // 비활성 상태로 전환
      if (!this.checkCorrect($this.textContent)) {
        $this.classList.add("incorrect"); // 빨간색 변경
      } else {
        $this.classList.add("correct"); // 파란색 변경
        this.score++; // 점수 증가
      }
    }

    setAllDisabled() {
      // 모든 option들에 disabled 클래스 부여
      const optionArray = this.$options.childNodes;
      for (let i = 0; i < optionArray.length; i++) {
        if (optionArray[i].classList.contains("option")) {
          optionArray[i].classList.add("disabled");
        }
      }
    }

    setFailed() {
      this.setAllDisabled();
      this.$next.classList.add("active");
    }

    getResult() {
      this.$quizBox.classList.remove("active");
      this.$resultBox.classList.add("active");
      let point = "";
      if (this.score === this.questions.length) {
        point = "만점!!!";
      } else {
        point = `${this.score}점`;
      }
      this.$scores.innerHTML = point;
    }

    getQuestion() {
      this.$title.innerHTML = "";
      this.$options.innerHTML = "";
      this.$title.innerHTML = this.questions[this.count].question; // 문항 값 가져오기

      // 각각의 옵션들을 this.questions의 options 배열들을 순회하며 할당
      const optionArray = this.questions[this.count].options; // 선택지 값 가져오기
      // 퀴즈 수만큼 반복
      for (let i = 0; i < optionArray.length; i++) {
        const optionItem = document.createElement("div");
        optionItem.innerText = optionArray[i];
        optionItem.classList.add("option");
        this.$options.appendChild(optionItem);
      }
      // 이벤트 등록
      this.$options.addEventListener("click", (e) => {
        if (e.target.className === "option") {
          this.getSelected(e.target);
        }
      });
    }

    getQuestionCounter() {
      this.$quizCount.innerHTML = `${this.questions.length}문제 중에 ${
        this.count + 1
      }문제`;
    }

    // 시간제한
    setTime() {
      this.$time.innerHTML = this.limit--;
      if (this.limit < this.time) {
        cancelAnimationFrame(this.timer);
        this.setFailed();
      } else {
        this.timer = requestAnimationFrame(() => {
          setTimeout(this.setTime.bind(this), 1000 * 1);
        });
      }
    }

    // progress bar
    setLine() {
      cancelAnimationFrame(this.liner); // 이전에 진행되던 Animation 종료

      this.$line.style.transform = `translate3d(${(this.line += 0.166)}%, 0, 0)`;
      if (this.line >= 100) {
        cancelAnimationFrame(this.liner);
        this.setFailed();
      } else {
        this.liner = requestAnimationFrame(() => {
          setTimeout(this.setLine.bind(this), 1.66);
        });
      }
    }
  }

  new QuizApp();
})();
