import PropTypes from 'prop-types'; // prop 타입 검증
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { ko } from "date-fns/locale/ko";
import useTrafficStore from '../../store/TrafficStore'; // 도로용 Zustand 스토어 가져오기
import useRegionStore from '../../store/RegionStore'; // 경로 찾기용 Zustand 스토어 가져오기

import 'react-datepicker/dist/react-datepicker.css';
import './DateTime.css';

function DateTime({ onSearch, showTimeSelect, type }) {
    const [startDate, setStartDate] = useState(new Date(2024, 7, 1, 12)); // 초기화, 시간 12시로 설정
    const setTrafficDateTime = useTrafficStore(state => state.setSelectedDateTime); // 도로 혼잡도용 상태 업데이트 함수
    const setRegionDateTime = useRegionStore(state => state.setSelectedDateTime); // 경로 찾기용 상태 업데이트 함수

    // 시간 포맷팅 헬퍼 함수
    const formatTimeDisplay = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        return `${hours}시`;
    };

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
        // 날짜만 가져오기 위해 시간 관련 정보를 무시하고 yyyy-mm-dd 형식으로 변환
        const date = startDate.toISOString().split('T')[0];
        const time = startDate.getHours().toString().padStart(2, '0'); // 시간을 2자리 24시간 형식으로 변환

        if (type === 'traffic') {
            setTrafficDateTime(date, time); // 도로 혼잡도용 상태 업데이트
        } else if (type === 'region') {
            setRegionDateTime(date); // 경로 찾기용 상태 업데이트 (시간 제외)
        }

        onSearch(startDate);
    };

    return (
        <>
            <DatePicker
                locale={ko}
                selected={new Date(startDate.setHours(12, 0, 0, 0))} // 초기 선택 날짜의 시간을 12:00으로 설정
                onChange={(date) => setStartDate(date)}
                dateFormat={showTimeSelect ? "yyyy-MM-dd HH시" : "yyyy-MM-dd"} // 시간 선택 여부에 따라 포맷 변경, 시간에는 '시' 추가
                customInput={<ExampleCustomInput value={showTimeSelect ? `${startDate.toISOString().split('T')[0]} ${formatTimeDisplay(startDate)}` : startDate.toISOString().split('T')[0]} />} // 시간 표시 포맷팅
                showTimeSelect={showTimeSelect} // 시간 선택 여부
                timeFormat="HH" // 선택한 시간 나타나게함
                timeIntervals={60} // 1시간 단위로 선택
                minDate={new Date(2024, 7, 1)} // 2024년 8월 1일
                maxDate={new Date(2024, 7, 31)} // 2024년 8월 31일
            />
            <Button variant="dark" className='btn' onClick={handleButtonClick}>조회</Button>
        </>
    );
}

DateTime.propTypes = {
    onSearch: PropTypes.func.isRequired, // onSearch는 함수이며 필수
    showTimeSelect: PropTypes.bool, // showTimeSelect는 선택적 부울 값
    type: PropTypes.string.isRequired // type은 문자열이며 필수 ('traffic' 또는 'region')
};

export default DateTime;
