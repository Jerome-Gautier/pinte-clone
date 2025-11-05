-- Insert mock users
INSERT INTO users (username, email) VALUES
('johndoe', 'johndoe@example.com'),
('janedoe', 'janedoe@example.com'),
('alexsmith', 'alexsmith@example.com');

-- Insert 9 unique SFW images (3 per user) with working direct URLs and matching titles
INSERT INTO images (user_id, url, title, description) VALUES
(1, 'https://64.media.tumblr.com/c2412733886486d3d53e6342e1d9c420/tumblr_ohh9btjf431scpynio2_1280.jpg', 'Black woman', ''),
(1, 'https://images.pexels.com/photos/5259405/pexels-photo-5259405.jpeg', 'Hitchhicking to Mars', ''),
(1, 'https://i.pinimg.com/736x/3f/6c/d1/3f6cd1457a63237cde56e2dab04d85d4.jpg', 'Cute squirrel', ''),
(2, 'https://preview.redd.it/l9vklw5gh4841.jpg?width=1080&crop=smart&auto=webp&s=bdaafa9366afbb1e27252c250e0f519069c2ffb4', 'Cute Cat', ''),
(2, 'https://restoredministriesblog.wordpress.com/wp-content/uploads/2016/12/img_2306.png', 'Dancing bride', ''),
(2, 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*II7Ws6crnikfy8ysN-aQ3w.jpeg', 'Scatterred Legos', ''),
(3, 'https://www.tradeinn.com/f/13969/139695884_2/kruskis-sweat-shirt-shadow-motorbike-two-colour.webp', 'Shadow motorbike', ''),
(3, 'https://images.squarespace-cdn.com/content/v1/6204821bfe06b76898b431c5/451e02a8-f343-4b0f-b17e-8abb0968854c/AW5A5778.jpg?format=2500w', 'Woman posing', ''),
(3, 'https://m.media-amazon.com/images/I/51JbPFbRv3L._SL1500_.jpg', 'Last day of the dinosaurs', '');