
# Ticket-Reservation-System

Overview

Developing a ticket reservation system that allows users to book, confirm, and cancel tickets.
The system should also have the ability to automatically cancel bookings that are not confirmed
within a certain time frame and provide partial refunds for cancelled bookings.

Requirements

- Display List of Tickets:
The system should be able to display a list of all available tickets, including their name,
price and remaining number.
The system should indicate which tickets are currently available or booked.
- Book Ticket:
Users should be able to book a ticket if it is available.
When a ticket is booked, the system should update the ticket's availability and record the
booking details, including the user's name and the booking time.
- Confirm Booking:
Users should be able to finish their payment and confirm their booking within a certain time
frame (e.g., 5 minutes).

When a booking is confirmed (payment is done), the system should update the ticket's
confirmation time and store payment details.

- Cancel Ticket:
Users should be able to cancel their booking.

When a booking is canceled, the system should refund 90% of the ticket price to the user
and update the ticket's availability.

- Auto-cancel Bookings:
The system should automatically cancel any bookings that are not confirmed within the
specified time frame (e.g., 5 minutes).

(The system should be able to handle multiple tickets and bookings at a time.)

(As this is just an example coding review, you can modify or add more specific requirements)
based on your needs

Expected outputs:
- Brief explanation of the design and implementation choices
- List of edge cases that possibly happen (e.g: Booking spam, ...)
- Database design
- Implementation of APIs

## Mục lục

 - Giới thiệu
- Các tính năng chính
- Yêu cầu hệ thống
- Cài đặt
- Sử dụng
- API


## Các tính năng chính

* Đặt vé trực tuyến.
* Tích hợp thanh toán với Stripe.
* Xác nhận đặt vé qua thanh toán.
* Tự động hủy đặt vé nếu không được xác nhận trong khoảng thời gian nhất định. (5 phút)
* Hủy vé và hoàn tiền (refund).
* Xử lý các trường hợp thanh toán thất bại.
* Thêm, sửa, xóa vé và hiển thị tất cả vé
## Yêu cầu hệ thống
- Node.js v14+.
- NPM v6+.
- Tài khoản Stripe.
## Cài đặt
1. Clone repository:

```http
  git clone https://github.com/titbe/Ticket-Reservation-System.git
```

2. Cài đặt các package:

```http
  cd Ticket-Reservation-System
  npm install
```
 
3. Thiết lập biến môi trường:
Tạo file .env và cấu hình các biến môi trường sau:
```http
  PORT = your_port (3000)
  MONGO_URI = your_mongo_uri
  STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Khởi chạy server:

```http
npm start
```
Mặc định server sẽ chạy trên http://localhost:3000

## Sử dụng
Sau khi khởi động server, bạn có thể truy cập vào hệ thống qua URL http://localhost:3000 . Dùng Postman call các API đã tạo để test
## API 
Hệ thống cung cấp các API RESTful để quản lý việc đặt vé, thanh toán và hủy vé. Tất cả các API đều yêu cầu dữ liệu dạng JSON.

#### Đặt vé
 ```http
POST /book/:ticketId
```

Mô tả: Tạo đơn đặt vé mới và trả về id của đơn đặt vé đó (bookingId). Cập nhật lại số lượng vé. Tạo một hàm setTimeout để xóa những đơn đặt không xác nhận trong khoảng thời gian 5 phút

Giải thích
| Tham số | Kiểu dữ liệu      | Mô tả                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Tên người dùng đặt vé. Được truyền trong req.body |
| `quantity` | `number` | **Required**. Số lượng vé cần đặt. Được truyền trong req.body |
| `ticketId` | `objectId` | **Required**. Id của vé, cần truyền vào ở req.params để xác định vé định đặt|
| `bookingId` | `objectId` | **Required**. Id của đơn đặt, được trả về khi người dùng đặt vé thành công |

#### Xác nhận đặt vé

```http
   POST /confirm/:bookingId
```

Mô tả: Xác nhận thanh toán thành công và hoàn tất đơn đặt vé. Xác nhận thanh toán đặt vé thông qua **Stripe**

Giải thích
| Tham số | Kiểu dữ liệu      | Mô tả                |
| :-------- | :------- | :------------------------- |
| `paymentMethodId` | `objectId` | **Required**. Đại diện cho một phương thức thanh toán. Được truyền trong req.body |
| `bookingId` | `objectId` | **Required**. Id của đơn đặt, được trả về khi người dùng đặt vé thành công |

Lưu ý:

Khi truyền paymentMethodId ngoài **pm_card_visa**, Stripe cung cấp một loạt các mã phương thức thanh toán thử nghiệm cho nhiều loại thẻ khác nhau. Dưới đây là một số mã phổ biến:

- **pm_card_visa**: Thẻ Visa.

- **pm_card_mastercard**: Thẻ Mastercard.

- **pm_card_amex**: Thẻ American Express.

- **pm_card_discover**: Thẻ Discover.

- **pm_card_jcb**: Thẻ JCB.

- **pm_card_diners**: Thẻ Diners Club.

- **pm_card_unionpay**: Thẻ UnionPay.

#### Hủy vé
 ```http
POST /cancel/:bookingId
```

Mô tả: Hủy một đơn đặt vé và xử lý hoàn tiền. Cập nhật lại số lượng vé

Giải thích
| Tham số | Kiểu dữ liệu      | Mô tả                |
| :-------- | :------- | :------------------------- |
| `bookingId` | `objectId` | **Required**. Id của đơn đặt, được trả về khi người dùng đặt vé thành công |

Khi hủy vé người dùng sẽ được hoàn trả lại 90% số tiền đã xác nhận đặt vé trước đó

#### Lấy thông tin vé
 ```http
GET /tickets
```

Mô tả: Lấy thông tin chi tiết về các loại vé


