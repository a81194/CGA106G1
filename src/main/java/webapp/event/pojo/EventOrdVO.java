package webapp.event.pojo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok: Gene getter/setter by @getter/@setter
@AllArgsConstructor // Lombok: Auto gene args constructor
@NoArgsConstructor // Lombok: read above
@Entity // JPA: mark this class as entity
@Table(name = "EVENT_ORD")// JPA: specify the table this class mapping to
public class EventOrdVO {

    //    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    @Id // JPA: primary key
    @Column(name = "EVENT_NO")// JPA: map to column
    private int eventno;
     // JPA: primary key
    @Column(name = "MEM_NO")
    private int memNo;

    @Column(name = "MEM_CHECKED")
    private int memChecked;


    @Column(name = "MEM_NAME")
    private String memName;

    @Column(name = "MEM_ADDRESS")
    private String memAddress;

    @Column(name = "MEM_EMAIL")
    private String memEmail;

    @Column(name = "MEM_PHONE")
    private String memPhone;

    @Column(name = "EVENT_STATUS")
    private int  enevtStatus;
}