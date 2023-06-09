package webapp.product.pojo;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import webapp.member.pojo.Members;

import java.lang.reflect.Member;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ORDERS")
public class Orders {

    @Id
    @Column(name="ORD_NO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ordNo;

    @Column(name="MEM_NO")
    private Integer memNo;

    @Column(name="USE_COUPON")
    private Integer useCoupon;

    @Column(name="ORD_FEE")
    private Integer ordFee;

    @Column(name="ORD_STATUS")
    private Integer ordStatus;

    @Column(name="ORD_CREATE")
    private Date ordCreate;

    @Column(name="ORD_PICK")
    private Integer ordPick;

    @Column(name="ORD_PAY_STATUS")
    private Integer ordPayStatus;

    @Column(name="ORD_FINISH")
    private Date ordFinish;

    @Column(name="TOTAL_AMOUNT")
    private	Integer totalAmount;

    @Column(name="ACTUAL_AMOUNT")
    private Integer actualAmount;

    @Column(name="RECIPIENT")
    private String recipient;

    @Column(name="RECIPIENT_ADDRES")
    private String recipientAddres;

    @Column(name="RECIPIENT_PH")
    private String recipientPh;

//    @ManyToOne
//    @JoinColumn(name = "MEM_NO",insertable = false,updatable = false)
//    private Members members;
}
