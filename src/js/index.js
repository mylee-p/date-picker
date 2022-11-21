class DatePicker {
  monthData = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  #calendarDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };

  selectedDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarMonthEl;
  montnContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;

  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    //오늘 날짜를 기준으로 date-input에 동적으로 입력된다.
    this.setDateInput();
    this.addEvent();
  }
  initSelectedDate() {
    //#calendarDate의 정보를 그대로 가져온다.
    //초기화된 #calendarDate는 처음에는 선택된게 없을테니까
    //calendarDate를 selectedDate에 넣어서 초기화 해준다.
    this.selectedDate = { ...this.#calendarDate };
  }

  //initSelectedDate를 기반으로 initDateInput을 채워준다.
  setDateInput() {
    //자바스크립트로 동적으로 스트립트를 넣어준다.
    //위의 파편화된 정보를 데이터 인풋에 넣기위해 포맷해주는 작업이 필요하다.
    //this.formateDate(날짜정보);
    //날짜정보 부분에 selected된 date의 data를 넣어준다.
    this.dateInputEl.textContent = this.formateDate(this.selectedDate.data);

    //html에 date value 속성 사용해서 날짜 정보로 new Date객체에서 생성한 날짜 정보를
    //input에 넣어주는 로직
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }

  initCalendarDate() {
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input");
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.calendarEl.querySelector("#month");
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    this.calendarDatesEl = this.calendarEl.querySelector("#dates");
  }

  addEvent() {
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener("click", this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener("click", this.moveToPrevMonth.bind(this));
    //원하는 일을 클릭하면 date-input에 해당 일이 자동으로 입력되는 메소드
    //calendarDatesEl는 date들의 컨테이너 역할을 하고 이벤트 버블링을 이용해서
    //모든 셀마다 이벤트를 추가하는 것이 아니라 전체를 감싸고 있는 컨테이너에 이벤트를 추가해서
    //그 안에서 어떤 셀을 클릭하는지 캐치할 수 있도록.
    this.calendarDatesEl.addEventListener(
      "click",
      this.onClickSelectorDate.bind(this)
    );
  }
  //이벤를 받아서 eventTarget에 dataset에 date기 있으면 조건문을 실행해라.
  //현재 셀에 해당하는 것만 data에 date 정보를 넣어놨기 때문에
  //이 엘레멘트 안에서만 조건문에 들어갈 수 있게 된다. [이벤트 버블링으로 이 엘레먼트들을 거른 것.]
  onClickSelectorDate(event) {
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      //class앞에 옵셔널체이닝을 추가해준다. [ 없을 수도 있으니까 ]
      this.calendarDatesEl
        .querySelector(".selected")
        ?.classList.remove("selected");
      //그리고 우리가 누른 이벤트타겟에는 selected 클래스를 추가해준다.
      eventTarget.classList.add("selected");
      //필드에서 입력해 놓은 selectedDate에
      this.selectedDate = {
        //현재 보고 있는 달력의 연/월과 클릭한 데이터 정보를 가져와서 data속성에 넣어줬고
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date
        ),
        //지금 달력으로 보고 있는 날짜의 년 정보를 넣어주고
        year: this.#calendarDate.year,
        //지금 달력으로 보고 있는 날짜의 월 정보를 넣어주고
        month: this.#calendarDate.month,
        //클릭한 이벤트 타겟의 데이터 정보를 가져와서 넣어준다.
        date: eventTarget.dataset.date,
      };
      this.setDateInput();
      //원하는 날짜를 선택하면 캘린더가 안보이게 설정하는 로직
      this.calendarEl.classList.remove("active");
    }
  }

  //포맷데이터 메소드를 구현해서 날짜 정보를 우리가 보여주려는 날짜 형태로 포맷시키는 메소드
  formateDate(dateData) {
    //날짜 정보[dateData]를 가져오는데 date가 10보다 작으면 즉, 두자리 수가 아니라면
    //그냥 0을 붙여준다.
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    //month도 비슷하게 해주는데 index이기 때문에 +를 해줘서 실제 우리가 아는 달의 정보로 바꿔준다.
    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    //year도 위와 같은 형식으로 해준다.
    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }

  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }

  toggleCalendar() {
    //선택한 날을 클릭해서 input창에 해당 연/월/일로 입력이 되고 다른 월로 캘린더를 넘긴 상태에서
    //input창을 눌러 닫은 후 다시 열었을 때 선택한 연/월/일이 있는 캘린더가 보여지게 하는 메소드
    if (this.calendarEl.classList.contains("active")) {
      //다시 토글을 하게 될때 우리가 선택한 날짜의 달력으로 볼 수 있게 된다.
      this.#calendarDate = { ...this.selectedDate };
    }
    this.calendarEl.classList.toggle("active");
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  updateDates() {
    this.calendarDatesEl.innerHTML = "";
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0
    ).getDate();
    const fragment = new DocumentFragment();
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");
      dateEl.textContent = i + 1;
      dateEl.dataset.date = i + 1;
      fragment.appendChild(dateEl);
    }
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragment);
    this.colorSaturday();
    this.colorSunday();
    this.markToday();
    this.markSelectedDate();
  }

  //오늘 선택된 날짜를 마크하는 메소드 구현
  markSelectedDate() {
    if (
      //달력에서 보여지는 날짜정보들과 선택된 날짜정보들을 비교해서 조건문을 실향하게 된다.
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add("selected");
    }
  }

  markToday() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add("today");
    }
  }

  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = "blue";
    }
  }

  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1
          ).getDay()) %
        7
      })`
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = "red";
    }
  }
}

new DatePicker();
