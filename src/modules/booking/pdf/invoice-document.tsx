import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { InvoiceViewData } from "./invoice.types"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a202c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#0B3C6D",
    paddingBottom: 16,
    marginBottom: 24,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B3C6D",
    marginBottom: 4,
  },
  companyMeta: { fontSize: 9, color: "#4a5568", marginTop: 1 },
  invoiceBlock: { alignItems: "flex-end" },
  invoiceTitle: { fontSize: 20, fontWeight: "bold", color: "#C89B3C", marginBottom: 4 },
  invoiceNumber: { fontSize: 11, fontWeight: "bold" },
  invoiceDate: { fontSize: 9, color: "#4a5568", marginTop: 2 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0B3C6D",
    marginTop: 12,
    marginBottom: 6,
  },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 150, color: "#4a5568" },
  value: { flex: 1 },
  totals: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#0B3C6D",
    paddingTop: 6,
    marginTop: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    fontSize: 8,
    color: "#718096",
    textAlign: "center",
  },
})

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

function formatDate(date: Date | null): string {
  if (!date) return "-"
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date)
}

export function InvoiceDocument({ data }: { data: InvoiceViewData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{data.company.name}</Text>
            {data.company.appUrl ? <Text style={styles.companyMeta}>{data.company.appUrl}</Text> : null}
            {data.company.supportPhone ? (
              <Text style={styles.companyMeta}>Telp: {data.company.supportPhone}</Text>
            ) : null}
            {data.company.adminEmail ? (
              <Text style={styles.companyMeta}>Email: {data.company.adminEmail}</Text>
            ) : null}
          </View>
          <View style={styles.invoiceBlock}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>Tanggal: {formatDate(data.issuedAt)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data Jamaah</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{data.customer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{data.customer.email ?? "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telepon</Text>
          <Text style={styles.value}>{data.customer.phone ?? "-"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Detail Booking</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nomor Booking</Text>
          <Text style={styles.value}>{data.booking.bookingNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{data.booking.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Paket</Text>
          <Text style={styles.value}>{data.packageInfo.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Keberangkatan</Text>
          <Text style={styles.value}>
            {formatDate(data.schedule.departureDate)} — {formatDate(data.schedule.returnDate)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Titik Kumpul</Text>
          <Text style={styles.value}>{data.schedule.meetingPoint || "-"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Rincian Biaya</Text>
        <View style={styles.tableRow}>
          <Text style={{ flex: 2, fontSize: 9 }}>{data.packageInfo.title}</Text>
          <Text style={{ flex: 1, fontSize: 9, textAlign: "right" }}>{formatIDR(data.totalPrice)}</Text>
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Total Harga</Text>
            <Text>{formatIDR(data.totalPrice)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Uang Muka (Down Payment)</Text>
            <Text>{formatIDR(data.downPayment)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text>Sisa Saldo</Text>
            <Text>{formatIDR(data.remainingBalance)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Invoice ini dibuat otomatis oleh {data.company.name}. Hubungi{" "}
          {data.company.supportPhone || "customer service"} untuk pertanyaan lebih lanjut.
        </Text>
      </Page>
    </Document>
  )
}

