package webapp.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import webapp.booking.pojo.OpenHour;

@Repository
public interface OpenHourRepository extends JpaRepository<OpenHour, Integer> {
    // connection pool + similar to DAO(both support by extends Jpa repository)
    // program new DAO behavior here
}
