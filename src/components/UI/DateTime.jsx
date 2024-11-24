import PropTypes from 'prop-types'; // prop 타입 검증
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { ko } from "date-fns/locale/ko";
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기

import 'react-datepicker/dist/react-datepicker.css';
import './DateTime.css';

function DateTime({ onSearch }) {
    const [startDate, setStartDate] = useState(new Date(2024, 7, 1)); // 2024년 8월 1일로 초기화
    const setSelectedDateTime = useStore(state => state.setSelectedDateTime); // 선택한 날짜와 시간 변경 함수 가져오기

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

    const handleButtonClick = () => {
        const date = startDate.toISOString().split('T')[0]; // 날짜를 yyyy-mm-dd 형식으로 변환
        const time = startDate.toLocaleTimeString([], { hour: '2-digit', hour12: true }); // 시간을 1시간 단위로 변환
        setSelectedDateTime(date, time); // 선택한 날짜와 시간 상태 업데이트
        onSearch(startDate);
    };

    return (
        <>
            <DatePicker
                locale={ko}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd HH시"    //2024-10-11 19시
                customInput={<ExampleCustomInput />} // 커스텀입력 사용
                showTimeSelect // 시간 선택바 나오게
                timeFormat="HH시" // 선택한 시간 나타나게함
                timeIntervals={60} // 1시간 단위로 선택
                minDate={new Date(2024, 7, 1)} // 2024년 8월 1일
                maxDate={new Date(2024, 7, 31)} // 2024년 8월 31일
            />
            <Button variant="dark" className='btn' onClick={handleButtonClick}>조회</Button>
        </>
    );
}

DateTime.propTypes = {
    onSearch: PropTypes.func.isRequired // onSearch는 함수이며 필수
};

export default DateTime;