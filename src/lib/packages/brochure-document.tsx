import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { BrochureViewData } from "./brochure-generator"

const GOLD = "#D4AF37"
const NAVY = "#0B2D5C"
const GRAY = "#4a5568"

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a202c" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 16,
    marginBottom: 20,
  },
  brand: { fontSize: 20, fontWeight: "bold", color: NAVY },
  brandSub: { fontSize: 9, color: GRAY, marginTop: 2 },
  brochureTag: { fontSize: 11, fontWeight: "bold", color: GOLD, textTransform: "uppercase" },
  title: { fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 12 },
  metaRow: { flexDirection: "row", marginBottom: 6 },
  metaLabel: { width: 130, color: GRAY },
  metaValue: { flex: 1, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: NAVY,
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 12, color: GOLD },
  bulletText: { flex: 1 },
  footer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    fontSize: 9,
    color: GRAY,
    textAlign: "center",
  },
})

export function BrochureDocument({ data }: { data: BrochureViewData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Safiq Tour</Text>
            <Text style={styles.brandSub}>Perjalanan Ibadah Amanah & Berpengalaman</Text>
          </View>
          <Text style={styles.brochureTag}>Brosur Paket Umroh</Text>
        </View>

        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Durasi</Text>
          <Text style={styles.metaValue}>{data.duration}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Harga</Text>
          <Text style={styles.metaValue}>{data.priceLabel}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Maskapai</Text>
          <Text style={styles.metaValue}>{data.airline}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Hotel Mekkah</Text>
          <Text style={styles.metaValue}>{data.hotelMekah}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Hotel Madinah</Text>
          <Text style={styles.metaValue}>{data.hotelMadinah}</Text>
        </View>

        {data.highlights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Highlight Paket</Text>
            {data.highlights.map((h, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{h}</Text>
              </View>
            ))}
          </>
        )}

        {data.included.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Fasilitas Termasuk</Text>
            {data.included.map((f, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{f}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.footer}>
          {`Hubungi Safiq Tour — WhatsApp: ${data.contact.whatsappDisplay}. Konsultasikan paket ini atau daftarkan diri Anda sekarang.`}
        </Text>
      </Page>
    </Document>
  )
}
