package com.smartmove.backend.service;

import com.smartmove.backend.data.Payment;
import com.smartmove.backend.data.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment processPayment(Payment payment) {
        payment.setPaymentStatus("COMPLETED");
        return paymentRepository.save(payment);
    }
}