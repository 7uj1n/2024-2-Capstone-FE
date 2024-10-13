// import PropTypes from 'prop-types'; //prop 타입 검증
// import { forwardRef, useState } from "react";

// import DatePicker from "react-datepicker";
// import Button from 'react-bootstrap/Button';
// import { ko } from "date-fns/locale/ko";


// import 'react-datepicker/dist/react-datepicker.css';
// import './DateTime.css';

// function DateTime() {
//     const [startDate, setStartDate] = useState(new Date()); //날짜

//     const ExampleCustomInput = forwardRef(
//         ({ value, onClick, className }, ref) => (
//             <button className={`${className} example-custom-input`} onClick={onClick} ref={ref}>
//                 {value}
//             </button>
//         ),
//     );

//     ExampleCustomInput.displayName = "ExampleCustomInput"; // 이름 정의

//     ExampleCustomInput.propTypes = {
//         value: PropTypes.string.isRequired, // value는 문자열이며 필수
//         onClick: PropTypes.func.isRequired, // onClick은 함수이며 필수
//         className: PropTypes.string, // className은 문자열이며 선택적
//     }

//     return (
//         <>
//             <DatePicker
//                 locale={ko}
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="yyyy-MM-dd HH시"
//                 customInput={<ExampleCustomInput />}    //커스텀입력 사용
//                 showTimeSelect  //시간 선택바 나오게
//                 timeFormat="HH시"   //선택한 시간 나타나게함
//                 timeIntervals={60}  //1시간 단위로 선택
//             />
//             <Button variant="dark" className='btn'>조회</Button>{' '}
//         </>
//     );
// }

// export default DateTime;

import PropTypes from 'prop-types'; //prop 타입 검증
import { forwardRef, useState } from "react";

import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { ko } from "date-fns/locale/ko";

import 'react-datepicker/dist/react-datepicker.css';
import './DateTime.css';

function DateTime() {
    const [startDate, setStartDate] = useState(new Date()); //날짜

    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <button className={`${className} example-custom-input`} onClick={onClick} ref={ref}>
                {value}
            </button>
        ),
    );

    ExampleCustomInput.displayName = "ExampleCustomInput"; // 이름 정의

    ExampleCustomInput.propTypes = {
        value: PropTypes.string.isRequired, // value는 문자열이며 필수
        onClick: PropTypes.func.isRequired, // onClick은 함수이며 필수
        className: PropTypes.string, // className은 문자열이며 선택적
    }

    return (
        <>
            <DatePicker
                locale={ko}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd HH시"
                customInput={<ExampleCustomInput value={startDate ? startDate.toLocaleString() : ''} onClick={() => {}} />}    //커스텀입력 사용
                showTimeSelect  //시간 선택바 나오게
                timeFormat="HH시"   //선택한 시간 나타나게함
                timeIntervals={60}  //1시간 단위로 선택
            />
            <Button variant="dark" className='btn'>조회</Button>{' '}
        </>
    );
}

export default DateTime;