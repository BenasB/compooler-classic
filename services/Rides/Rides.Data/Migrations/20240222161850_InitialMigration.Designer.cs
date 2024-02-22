﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Rides.Data;

#nullable disable

namespace Rides.Data.Migrations
{
    [DbContext(typeof(RideContext))]
    [Migration("20240222161850_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Rides.Data.Entities.Ride", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("GroupId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GroupId", "StartTime")
                        .IsUnique();

                    b.ToTable("Rides");
                });

            modelBuilder.Entity("Rides.Data.Entities.RidePassenger", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ParticipationStatus")
                        .HasColumnType("integer");

                    b.Property<string>("PassengerId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("RideId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RideId");

                    b.ToTable("Passengers");
                });

            modelBuilder.Entity("Rides.Data.Entities.RidePassenger", b =>
                {
                    b.HasOne("Rides.Data.Entities.Ride", null)
                        .WithMany("Passengers")
                        .HasForeignKey("RideId");
                });

            modelBuilder.Entity("Rides.Data.Entities.Ride", b =>
                {
                    b.Navigation("Passengers");
                });
#pragma warning restore 612, 618
        }
    }
}
