package webapp.event.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Data
public class EventDTO {
    private Integer eventNo;

    @NotBlank(message = "賽事名稱未填寫")
    private String eventName;
    @NotBlank(message = "賽事資訊未填寫")
    private String eventDisc;

    private Date eventDate;


    @JsonFormat(pattern = "HH:mm", timezone = "GMT+8")
    private Timestamp eventStarttime;
    @JsonFormat(pattern = "HH:mm", timezone = "GMT+8")
    private Timestamp eventEndtime;

    @NotNull(message = "最少需要30人、最大是60人")
    @Min(value = 30,message = "最少要填入30人")
    @Max(value = 60,message = "最大要填入60人")
    private Integer eventLimit;

    private Integer signupNum;
    @NotNull(message = "參加費用未填寫，最少需要200元")
    @Min(value = 200, message = "參加費用最少需要200元")
    private Integer eventFee;
    private String eventWinner1;
    private String eventWinner2;
    private String eventWinner3;
    private Byte eventStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Timestamp signupStartTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Timestamp signupDeadline;

    private byte[] eventPic;


}
