package webapp.newbooking.controller;

import jakarta.annotation.Resource;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import webapp.booking.dto.SeatDTO;
import webapp.newbooking.dto.BookingDTO;
import webapp.newbooking.image.image;
import webapp.newbooking.pojo.newBooking;
import webapp.newbooking.service.BookingService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = "*")
public class newBookingController {

    @Autowired
    private BookingService BookingService;

    @GetMapping("/try")
    public String test(){
        return "aaa";
    }

    @GetMapping("/ls")
    public List<BookingDTO> getAllBooking(){
        return BookingService.getAllBooking();
    }
    @GetMapping("one")
    public List<BookingDTO> getOneBooking(Integer findno){
        return BookingService.getOneBooking(findno);
    }
    @GetMapping("bookingbymemno")
    public List<BookingDTO> getOnebookingbyMemno(Integer memno){
        return BookingService.findbookingbymemno(memno);
    }
    @GetMapping(value="oneimage", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getimagebooking(Integer findno) throws IOException {
        OutputStream out = null;
        File file = new File("src/main/resources/static/background/static/image/img1.jpg");
        FileInputStream inputStream = new FileInputStream(file);
        byte[] bytes = new byte[inputStream.available()];
        inputStream.read(bytes, 0, inputStream.available());
        return bytes;
    }
        @PostMapping("addbooking")
    public  BookingDTO insertbooking(@RequestBody newBooking insertbook){
        try{
        System.out.println(insertbook.getBookingNo());
        return BookingService.insertBooking(insertbook);}
        catch (Exception e){
            System.out.println("錯誤");
        }
        return null;
    }
    @PostMapping("updatebooking")
    public  BookingDTO updatetbooking(@RequestBody newBooking insertbook){
        System.out.println(insertbook.getBookingNo());
        return BookingService.updateBooking(insertbook);}
    @PostMapping("deletebook")
    @ResponseBody
    public  BookingDTO deleteBooking(Integer deleteno){return  BookingService.deleteBooking(deleteno);}

    @PostMapping("paystatus")
    @ResponseBody
    public Boolean paystatus(Integer pay,Integer memno){
        System.out.println(memno);
       return BookingService.updatepay(pay,memno);
    }
    @PostMapping("checkstatus")
    @ResponseBody
    public Boolean checkstatus(Integer check,Integer memno){
       return BookingService.updatecheck(check,memno);
    }
    @GetMapping("redirect")
    public RedirectView redirectView(Integer changeno){
        System.out.println(changeno);
        String url;
        if(changeno==null){
         url="http://localhost:63342/CGA106G1/boardgameSpring/static/foreground/user_booking.html";
        }else{
         url="http://localhost:63342/CGA106G1/boardgameSpring/static/foreground/insertBooking.html";
        }
        return new RedirectView(url);
    }
    @Resource
    private image Toimage;
    @GetMapping("/image")
    public void download(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
            throws ServletException, IOException {
            File file = new File("src/main/resources/static/background/static/image/img1.jpg");
            httpServletRequest.setAttribute(image.ATTRIBUTE_FILE, file);
//        Toimage.handleRequest(httpServletRequest, httpServletResponse);
    }
    @Autowired
    RedisTemplate redisTemplate;

    @RequestMapping("/addredis")
    public String addRedis(String date, String time,Integer seat) {
        HashMap timeSeat=new HashMap();
        try {for(int i=1;i<25;i++)
        {
            time=""+i+":00:00";
            timeSeat.put(time,seat);

        }
        redisTemplate.opsForValue().set(date, timeSeat);
        return "加入成功";
        }catch (Exception E){
            return  "加入失敗";
        }
    }
    @RequestMapping("/addseat")
    public  String changeseat(String date, Integer seat){
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());

        for(int i=0;i<24;i++){
            if(i%2==0)
        redisTemplate.opsForList().leftPush(date,""+seat);
            else
        redisTemplate.opsForList().leftPush(date,""+seat/2);
        }

        return "change";
    }
    @RequestMapping("/addDatetime")
    public String insertRedis(String datetime,Integer seat) {

            redisTemplate.opsForValue().set(datetime, "60");
            return "加入";
    }
    @RequestMapping("/")
    public Object getRedis(String date ,Integer TIME) {
        Object value = redisTemplate.opsForValue().get(date);
        return value;
    }
    @RequestMapping("/changeseat")
    public Object getindex(String date ,Integer TIME,Integer People) {
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        Integer value =Integer.parseInt( (String)  redisTemplate.opsForList().index(date,TIME));
        if((value-People)>0){

        value=value-People;
        String val=""+value;
        redisTemplate.opsForList().set(date, TIME, val);

        return "剩餘"+value+"座位";
        }else
            return "沒座位了";
    }
    @PostMapping("/testseat") //(查看日期時段區間最小座位數)
    public Integer minseat(String date,Integer minTime,Integer maxTime){
        try{
        System.out.println(date+minTime+maxTime);
        return BookingService.minseat(date,minTime,maxTime);
        }catch (Exception e){
            return -100;
        }
    }
    @PostMapping("/saveseat4time") //儲存日期時間段座位數
    public List<SeatDTO> saveseat4time(String date, Integer minTime, Integer maxTime,Integer change){
    return BookingService.saveseat(date,minTime,maxTime,change);
    }

}
