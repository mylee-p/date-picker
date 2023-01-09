## Date Picker
input box를 클릭하면 달력이 토글로 표시
현재 날짜를 보라색으로 자동 마크
선택한 날짜는 주황색으로 마크
선택한 날짜는 input box에 자동 입력
토요일은 파란색, 일요일은 빨간색으로 동적으로 표시
양 옆의 버튼을 통해 이전달, 다음달의 정보를 가져온다.
선택한 날짜는 월을 넘겼다가 돌아와도 그대로 선택되어 있음(정보저장)
선택한 날짜는 달력 토글창을 닫았다가 열어도 그대로 선택되어 있음(정보저장)

<img width="1000" alt="datepicker" src="https://user-images.githubusercontent.com/89143892/211232166-cb5b971a-50a8-4d1a-87fe-6ed9d22f1c2e.png">
<br />

### 개발환경설정 - snowpack

```
$ npm init -y
$ npm i -D snowpack
$ npm i -D @snowpack/plugin-sass
```

```js
//snowpack.config.js

module.exports = {
  mount: {
    public: { url: '/', static: true }, // '/' : 최상위
    src: { url: '/dist' },
  },
  optimize: {
    minify: true,
  },
  plugins: [
    '@snowpack/plugin-sass', //설치한 플러그인을 string으로 넣어준다.
  ],
};
```

```
$ npm run start

$ npm run build
```

```
$ npm i -D eslint
$ npm i --save-exact prettier
$ npm i -D eslint-config-prettier eslint-plugin-prettier
```

```json
//.eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:prettier/recommended"],
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error"
  }
}
```

```json
//.eslintignore

/node_modules
/build
snowpack.config.js
```

```json
//.prettierrc.json

{
  "trailingComma": "all",
  "bracketSpacing": true,
  "useTabs": false,
  "semi": true,
  "printWidth": 80,
  "arrowParens": "avoid",
  "proseWrap": "never",
  "endOfLine": "auto",
  "tabWidth": 2,
  "singleQuote": true
}
```

```json
//.prettierignore

/node_modules
/build
snowpack.config.js
```

```json
//Open workspace Settings(JSON)

{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 날짜 조회 기능 개발

> 클래스 변수로 표시해줄 달에 대한 정보들을 set하는 변수,<br /> string array로 월별의 영문표기를 가져왔다.

```js
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
```

> private 변수 생성<br /> 캘린더 안에서 관리하는 변수, 달력이 보이는데 사용될 날짜들에 대한 정보

```js

  #calendarDate = {
    data: "", //js에 new Date()객체를 사용해서 관련 정보를 저장.
    date: 0, //날짜
    month: 0,
    year: 0,
  };

  selectedDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };
```

> 각 기능을 하는 엘리먼트를 사용하고 있다는 것을 바로 알 수 있게 필드에 추가해준다.

```js
  datePickerEl;
  dateInputEl;
  calendarMonthEl;
  montnContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;

  //입력 순서대로 메소드를 constructor에 넣어준다.
  constructor() {
    this.initCalendarDate();
    this.assignElement();
    this.addEvent();
  }
```

> 달력의 날짜 정보들을 초기화하는 메소드 생성

```js
  initCalendarDate() {
    const data = new Date(); //따로 파라미터를 넣지 않으면 현재를 기준으로 날짜 정보가 생성된다.
    const date = data.getDate(); //몇일인지 정보를 가져오고
    const month = data.getMonth(); //이번 달이 몇 월인지 정보를 가져오는데 0부터 시작되기때문에 0~11로 리턴이 된다.
    const year = data.getFullYear(); //현재 날짜의 연도 정보를 가져온다.
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }
```

> 엘리먼트 탐색 메소드

```js
  //엘리먼트 탐색 메소드
  assignElement() {
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input"); //id를 탐색할 때는 #필수
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.calendarEl.querySelector("#month");
    //지금의 연/월/일을 표시해주는 엘리먼트
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    //next, prev 버튼 엘리먼트
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    //day[월화수목금토일]은 SCC영역에서 처리했기 때문에 따로 하지 않고 dates엘리먼트를 불러온다.
    this.calendarDatesEl = this.calendarEl.querySelector("#dates");
  }
```

> 이벤트 메소드

```js
  addEvent() {
    //상단의 날짜를 눌렀을 때 calendar에 active가 추가되어 달력을 보여주는 메소드
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
    //next, prev 버튼을 눌러서 다음달, 이전달을 탐색하는 메소드
    this.nextBtnEl.addEventListener("click", this.moveNextMonth.bind(this));
    this.prevBtnEl.addEventListener("click", this.movePrevtMonth.bind(this));
  }
```

> 동적으로 해당 달의 날짜를 생성해주는 메소드

```js
  moveNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }

  movePrevtMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }
```

> 토글로 연도와 월의 영어표기가 노출되는 메소드

```js
toggleCalendar() {
  this.calendarEl.classList.toggle("active");
  this.updateMonth();
  this.updateDates();
}
```

> 월별 업데이트

```js
updateMonth() {
  this.monthContentEl.textContent = `${this.#calendarDate.year} ${
    this.monthData[this.#calendarDate.month]
  }`;
}
```

> 업데이트 될 때 마다 새로 동적으로 날짜를 생성하는 메소드

```js
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
    //그 달의 첫번째 날 즉, 1일이 어느요일에서 시작하는지를 알 수 있는 로직
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragment);

    //토요일과 일요일인 날들을 찾아서 파란색과 빨간색을 표시해주는 메소드 구현
    this.colorSaturday();
    this.colorSunday();

    //업데이트가 되었을 때 오늘 날짜에 마크를 해주는 메소드 구현
    this.markToday();
  }
```

> 업데이트가 되었을 때 오늘 날짜에 마크를 해주는 메소드

```js
  markToday() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); //0부터 시작
    const currentYear = currentDate.getFullYear(); //이번년도가 몇년인지
    const today = currentDate.getDate(); //오늘이 몇 일인지

    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      //calendarDatesEl에서 data-date 속성 탐색을 해서 today를 찾고
      //classList에 today를 넣어준다.
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add("today");
    }
  }
```

> 토요일에 해당하는 날짜는 모두 파란색으로 표시해주는 메소드

```js
  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        //해당 달에 1일이 무슨 요일인지 알 수 있다.
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() //getDay()는 0부터 시작된다.
      })`
    );
    //7n+1의 의미는 n이 0부터 시작하게 되니까
    //1, 8, 15, 22, 29 번째를 찾아서 파란색으로 표시하겠다는 의미
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = "blue";
    }
  }
```

> 일요일에 해당하는 날짜는 모두 빨간색으로 표시해주는 메소드

```js
  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      //전체를 감싼 다음에 7로 나눠준 것이고,
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1
            //나누기 7을해서 나머지를 구한 값을 계산식에 넣어주었다.
          ).getDay()) %
        7
      })`
    );

    //for문을 이용해서 일요일에 해당하는 일들을 빨간색으로 표시해준다.
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = "red";
    }
  }
}
```

> 클래스 생성 시 인스턴스를 생성해야 정상적으로 실행된다.

```js
new DatePicker();
```

### 날짜 입력 기능 개발

> constructor에 오늘 날짜를 기준으로 date-input에 동적으로 입력되는 메소드를 넣어준다.

```js
constructor() {
    .
    .
    this.setDateInput();
    this.addEvent();
  }
```

> new Date 객체에서 생성한 날짜 정보를 input에 넣어준다

```js
  initSelectedDate() {
    this.selectedDate = { ...this.#calendarDate };
  }

  setDateInput() {
    //자바스크립트로 동적으로 스트립트를 넣어준다.
    this.dateInputEl.textContent = this.formateDate(this.selectedDate.data);

    this.dateInputEl.dataset.value = this.selectedDate.data;
  }
```

> 원하는 날짜를 클릭하면 date-input에 해당 날짜가 자동으로 입력되는 메소드 <br /> 이벤트 버블링 효과

```js
  addEvent() {
    .
    .
    .
    //calendarDatesEl는 date들의 컨테이너 역할을 하고 이벤트 버블링을 이용해서
    //모든 셀마다 이벤트를 추가하는 것이 아니라 전체를 감싸고 있는 컨테이너에
    //이벤트를 추가해서 그 안에서 어떤 셀을 클릭하는지 캐치할 수 있도록한다.
    this.calendarDatesEl.addEventListener(
      "click",
      this.onClickSelectorDate.bind(this)
    );
  }
```

> 이벤를 받아서 eventTarget에 dataset에 date가 있으면 조건문을 실행<br /> 옵셔널체이닝

```js
onClickSelectorDate(event) {
  const eventTarget = event.target;
  if (eventTarget.dataset.date) {
    this.calendarDatesEl
      .querySelector(".selected")
      ?.classList.remove("selected");
    eventTarget.classList.add("selected");
    this.selectedDate = {
      data: new Date(
        this.#calendarDate.year,
        this.#calendarDate.month,
        eventTarget.dataset.date
      ),
      //지금 달력으로 보고 있는 날짜의 년 정보
      year: this.#calendarDate.year,
      //지금 달력으로 보고 있는 날짜의 월 정보
      month: this.#calendarDate.month,
      //클릭한 이벤트 타겟의 데이터 정보
      date: eventTarget.dataset.date,
    };
    this.setDateInput();
    //원하는 날짜를 선택하면 캘린더가 안보이게 설정
    this.calendarEl.classList.remove("active");
  }
}
```

> 포맷데이터 메소드를 구현해서 날짜 정보를 보여주려는 날짜 형태로 포맷시키는 메소드

```js
  //
  formateDate(dateData) {
    //날짜 정보[dateData]를 가져오는데 date가 10보다 작으면
    //즉, 두자리 수가 아니라면 그냥 0을 붙여준다.
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    //month도 비슷하게 해주는데 index이기 때문에 +를 해서
    //실제 우리가 아는 달의 정보로 바꿔준다.
    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }
```

> input 창을 닫은 후 다시 열었을 때 선택한 연/월/일이 있는 캘린더가 보여지게 하는 메소드

```js
  toggleCalendar() {
    if (this.calendarEl.classList.contains("active")) {
      //다시 토글을 하게 될때 선택한 날짜의 달력으로 볼 수 있게 된다.
      this.#calendarDate = { ...this.selectedDate };
    }
    this.calendarEl.classList.toggle("active");
    this.updateMonth();
    this.updateDates();
  }
```

> 오늘 선택된 날짜를 마크하는 메소드 구현

```js
  markSelectedDate() {
    if (
      //달력에서 보여지는 날짜정보들과 선택된 날짜정보들을 비교해서 조건문을 실행
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add("selected");
    }
  }
```
