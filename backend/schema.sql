-- ─────────────────────────────────────────────────────────────────────────────
-- Art Gallery — Database Schema & Seed Data
-- Run this file in MySQL Workbench or with:
--   mysql -u root -p < schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS art_gallery;
USE art_gallery;

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS artworks (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(255)   NOT NULL,
  artist      VARCHAR(255)   NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  image_url   TEXT,
  description TEXT,
  medium      VARCHAR(100),
  dimensions  VARCHAR(100),
  year        INT,
  available   BOOLEAN        DEFAULT 1,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  buyer_name  VARCHAR(255)   NOT NULL,
  buyer_email VARCHAR(255)   NOT NULL,
  artwork_id  INT            NOT NULL,
  quantity    INT            DEFAULT 1,
  total_price DECIMAL(10,2)  NOT NULL,
  placed_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artwork_id) REFERENCES artworks(id)
);

-- ── Seed Data — 8 sample artworks ────────────────────────────────────────────

INSERT INTO artworks (title, artist, price, image_url, description, medium, dimensions, year) VALUES
(
  'Monsoon Geometry',
  'Priya Nair',
  12500.00,
  'https://picsum.photos/seed/monsoon/600/750',
  'A sweeping study in abstraction — deep cerulean and viridian planes dissolve at their edges, evoking the blurred horizon of the Western Ghats just before the rains arrive.',
  'Oil on canvas',
  '90 × 120 cm',
  2023
),
(
  'Urban Dusk',
  'Arjun Mehra',
  8900.00,
  'https://picsum.photos/seed/dusk/600/750',
  'The city skyline reduced to its essential geometry: amber rectangles against a deepening violet sky. A meditation on light, density, and the anonymity of urban life.',
  'Acrylic on board',
  '60 × 80 cm',
  2022
),
(
  'Woven Light',
  'Sana Iqbal',
  21000.00,
  'https://picsum.photos/seed/woven/600/750',
  'Inspired by the textile traditions of Lucknow, this work translates intricate chikan embroidery patterns into layered oil glazes, creating depth that shifts with the viewer\'s angle.',
  'Oil on linen',
  '100 × 100 cm',
  2024
),
(
  'Red Ghat',
  'Vikram Das',
  6500.00,
  'https://picsum.photos/seed/ghat/600/750',
  'Varanasi at dawn, seen from a small wooden boat. The ancient stone steps glow an impossible red in the first light. Painted from a single morning sketch made in 2019.',
  'Watercolour on paper',
  '50 × 70 cm',
  2021
),
(
  'Silence No. 3',
  'Leila Roy',
  17800.00,
  'https://picsum.photos/seed/silence/600/750',
  'The third in an ongoing series exploring negative space through ink wash. A single horizontal brushstroke holds the entire composition in tension. Less is unequivocally more.',
  'Ink wash on paper',
  '70 × 100 cm',
  2024
),
(
  'Copper Dunes',
  'Ravi Shankar Pillai',
  9400.00,
  'https://picsum.photos/seed/dunes/600/750',
  'The Thar Desert reimagined through a palette of raw sienna and burnt copper. Wind-shaped forms rendered in thick impasto that casts its own shadows across the canvas.',
  'Oil on canvas',
  '80 × 100 cm',
  2023
),
(
  'Botanical Memory',
  'Meena Krishnaswamy',
  14200.00,
  'https://picsum.photos/seed/botanical/600/750',
  'Pressed flowers and leaves from her grandmother\'s garden in Coimbatore form the underdrawing for this luminous, layered work. Memory made visible through plant matter and pigment.',
  'Mixed media on canvas',
  '75 × 95 cm',
  2022
),
(
  'Blue Hour',
  'Farhan Qureshi',
  11000.00,
  'https://picsum.photos/seed/bluehour/600/750',
  'Crepuscular light over a flat North Indian plain. This quiet, almost tonalist work captures the precise twenty minutes between sunset and darkness when colour drains from the world.',
  'Oil on panel',
  '55 × 75 cm',
  2023
);
